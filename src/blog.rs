use include_dir::{include_dir, Dir};

use super::*;
use crate::{post::MarkdownContent, Route};

// Include all markdown files from the content/posts directory
static POSTS_DIR: Dir = include_dir!("$CARGO_MANIFEST_DIR/content/posts");

#[derive(Debug, Clone)]
pub struct Post {
  pub id:      String,
  pub content: MarkdownContent,
}

impl Post {
  pub fn from_content(id: String, content: &str) -> Result<Self, Box<dyn std::error::Error>> {
    let markdown_content = MarkdownContent::from_markdown(content)?;
    tracing::debug!("Loaded post: {}", id);
    Ok(Self { id, content: markdown_content })
  }
}

pub async fn load_all_posts() -> Result<Vec<Post>, Box<dyn std::error::Error>> {
  let mut posts = Vec::new();

  tracing::debug!("Found {} files in posts directory", POSTS_DIR.files().count());

  // Iterate over all files in the posts directory
  for file in POSTS_DIR.files() {
    tracing::debug!("Processing file: {:?}", file.path());
    if let Some(ext) = file.path().extension() {
      if ext == "md" {
        let id =
          file.path().file_stem().and_then(|s| s.to_str()).ok_or("Invalid filename")?.to_string();

        let content = file.contents_utf8().ok_or("Invalid UTF-8 content")?;

        match Post::from_content(id.clone(), content) {
          Ok(post) => posts.push(post),
          Err(e) => tracing::error!("Error loading post {}: {}", id, e),
        }
      }
    }
  }

  // Sort posts by date in descending order
  posts.sort_by(|a, b| b.content.frontmatter.date.cmp(&a.content.frontmatter.date));

  tracing::info!("Loaded {} posts", posts.len());
  Ok(posts)
}

/// Blog listing page
#[component]
pub fn BlogList() -> Element {
  let mut posts = use_signal(|| Vec::<Post>::new());

  use_effect(move || {
    spawn(async move {
      match load_all_posts().await {
        Ok(loaded_posts) => {
          tracing::info!("Successfully loaded {} posts", loaded_posts.len());
          posts.set(loaded_posts);
        },
        Err(e) => tracing::error!("Error loading posts: {}", e),
      }
    });
  });

  rsx! {
      div { id: "blog-list",
          h1 { "Blog Posts" }
          if posts.read().is_empty() {
              p { "No blog posts found." }
          } else {
              div { class: "posts-grid",
                  for post in posts.read().iter() {
                      div { class: "post-preview",
                          Link {
                              to: Route::BlogPost {
                                  id: post.id.clone(),
                              },
                              h2 { "{post.content.frontmatter.title}" }
                              div { class: "post-meta",
                                  "By {post.content.frontmatter.author} on {post.content.frontmatter.date}"
                              }
                          }
                      }
                  }
              }
          }
      }
  }
}

/// Individual blog post page
#[component]
pub fn BlogPost(id: String) -> Element {
  let mut posts = use_signal(Vec::<Post>::new);

  use_effect(move || {
    spawn(async move {
      match load_all_posts().await {
        Ok(loaded_posts) => {
          tracing::info!("Successfully loaded {} posts", loaded_posts.len());
          posts.set(loaded_posts);
        },
        Err(e) => tracing::error!("Error loading posts: {}", e),
      }
    });
  });

  let post = posts.read().iter().find(|p| p.id == id).cloned();

  rsx! {
      div { id: "blog",
          if let Some(post) = post {
              h1 { "{post.content.frontmatter.title}" }
              div { class: "post-meta",
                  "By {post.content.frontmatter.author} on {post.content.frontmatter.date}"
              }
              div {
                  class: "post-content",
                  dangerous_inner_html: "{post.content.html_content}",
              }
          } else {
              h1 { "Post not found" }
              p { "The requested blog post does not exist." }
          }

          div { class: "blog-navigation",
              Link { to: Route::BlogList {}, "← Back to Blog" }
          }
      }
  }
}
