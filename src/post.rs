use pulldown_cmark::{html, Options, Parser};
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct FrontMatter {
    pub title: String,
    pub date: String,
    pub author: String,
}

#[derive(Debug, Clone)]
pub struct MarkdownContent {
    pub frontmatter: FrontMatter,
    pub html_content: String,
}

impl MarkdownContent {
    pub fn from_markdown(content: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let (frontmatter, markdown) = Self::parse_frontmatter(content)?;

        let options = Options::empty();
        let parser = Parser::new_ext(&markdown, options);
        let mut html_output = String::new();
        html::push_html(&mut html_output, parser);

        Ok(Self {
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
