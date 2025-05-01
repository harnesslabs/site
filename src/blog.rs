use dioxus::logger::tracing;
use include_dir::{include_dir, Dir};
use pulldown_cmark::{html, Options, Parser};
use serde::Deserialize;

// Include all markdown files from the content/posts directory
static POSTS_DIR: Dir = include_dir!("$CARGO_MANIFEST_DIR/content/posts");

#[derive(Debug, Deserialize, Clone)]
pub struct FrontMatter {
    pub title: String,
    pub date: String,
    pub author: String,
}

#[derive(Debug, Clone)]
pub struct Post {
    pub id: String,
    pub frontmatter: FrontMatter,
    pub html_content: String,
}

impl Post {
    pub fn from_content(id: String, content: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let (frontmatter, markdown) = Self::parse_frontmatter(content)?;

        let options = Options::empty();
        let parser = Parser::new_ext(&markdown, options);
        let mut html_output = String::new();
        html::push_html(&mut html_output, parser);

        tracing::debug!("Loaded post: {}", id);
        Ok(Self {
            id,
            frontmatter,
            html_content: html_output,
        })
    }

    fn parse_frontmatter(
        content: &str,
    ) -> Result<(FrontMatter, String), Box<dyn std::error::Error>> {
        let mut parts = content.splitn(3, "---");
        parts.next(); // Skip the first empty part

        let frontmatter_str = parts.next().ok_or("No frontmatter found")?;
        let markdown = parts.next().ok_or("No markdown content found")?;

        let frontmatter: FrontMatter = serde_yaml::from_str(frontmatter_str)?;

        Ok((frontmatter, markdown.trim().to_string()))
    }
}

pub async fn load_all_posts() -> Result<Vec<Post>, Box<dyn std::error::Error>> {
    let mut posts = Vec::new();

    tracing::debug!(
        "Found {} files in posts directory",
        POSTS_DIR.files().count()
    );

    // Iterate over all files in the posts directory
    for file in POSTS_DIR.files() {
        tracing::debug!("Processing file: {:?}", file.path());
        if let Some(ext) = file.path().extension() {
            if ext == "md" {
                let id = file
                    .path()
                    .file_stem()
                    .and_then(|s| s.to_str())
                    .ok_or("Invalid filename")?
                    .to_string();

                let content = file.contents_utf8().ok_or("Invalid UTF-8 content")?;

                match Post::from_content(id.clone(), content) {
                    Ok(post) => posts.push(post),
                    Err(e) => tracing::error!("Error loading post {}: {}", id, e),
                }
            }
        }
    }

    // Sort posts by date in descending order
    posts.sort_by(|a, b| b.frontmatter.date.cmp(&a.frontmatter.date));

    tracing::info!("Loaded {} posts", posts.len());
    Ok(posts)
}
