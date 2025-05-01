use pulldown_cmark::{html, Options, Parser};
use serde::Deserialize;
use std::fs;
use std::path::Path;

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
    pub fn from_file(path: &Path) -> Result<Self, Box<dyn std::error::Error>> {
        let content = fs::read_to_string(path)?;
        let (frontmatter, markdown) = Self::parse_frontmatter(&content)?;

        let options = Options::empty();
        let parser = Parser::new_ext(&markdown, options);
        let mut html_output = String::new();
        html::push_html(&mut html_output, parser);

        // Get the filename without extension as the ID
        let id = path
            .file_stem()
            .and_then(|s| s.to_str())
            .ok_or("Invalid filename")?
            .to_string();

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

pub fn load_all_posts() -> Result<Vec<BlogPost>, Box<dyn std::error::Error>> {
    let mut posts = Vec::new();
    let paths = glob::glob("content/posts/*.md")?;

    for path in paths {
        if let Ok(path) = path {
            if let Ok(post) = BlogPost::from_file(&path) {
                posts.push(post);
            }
        }
    }

    // Sort posts by date in descending order
    posts.sort_by(|a, b| b.frontmatter.date.cmp(&a.frontmatter.date));

    Ok(posts)
}

pub fn find_post_by_id<'a>(posts: &'a [BlogPost], id: &str) -> Option<&'a BlogPost> {
    posts.iter().find(|post| post.id == id)
}
