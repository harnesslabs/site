use dioxus::logger::tracing;
use dioxus::prelude::*;
use pulldown_cmark::{html, Options, Parser};
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct FrontMatter {
    pub title: String,
    pub date: String,
    pub author: String,
}

#[derive(Debug, Clone)]
pub struct BlogPost {
    pub id: String,
    pub frontmatter: FrontMatter,
    pub content: String,
    pub html_content: String,
}

impl BlogPost {
    pub fn from_content(id: String, content: String) -> Result<Self, Box<dyn std::error::Error>> {
        let (frontmatter, markdown) = Self::parse_frontmatter(&content)?;

        let options = Options::empty();
        let parser = Parser::new_ext(&markdown, options);
        let mut html_output = String::new();
        html::push_html(&mut html_output, parser);

        tracing::debug!("Loaded post: {}", id);
        Ok(BlogPost {
            id,
            frontmatter,
            content: markdown,
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

pub async fn load_all_posts() -> Result<Vec<BlogPost>, Box<dyn std::error::Error>> {
    let mut posts = Vec::new();

    // Load the hello-world post
    const HELLO_WORLD: &str = include_str!("../content/posts/hello-world.md");
    match BlogPost::from_content("hello-world".to_string(), HELLO_WORLD.to_string()) {
        Ok(post) => posts.push(post),
        Err(e) => tracing::error!("Error loading post hello-world: {}", e),
    }

    // Sort posts by date in descending order
    posts.sort_by(|a, b| b.frontmatter.date.cmp(&a.frontmatter.date));

    tracing::info!("Loaded {} posts", posts.len());
    Ok(posts)
}

pub fn find_post_by_id<'a>(posts: &'a [BlogPost], id: &str) -> Option<&'a BlogPost> {
    posts.iter().find(|post| post.id == id)
}
