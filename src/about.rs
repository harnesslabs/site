use dioxus::{logger::tracing, prelude::*};
use pulldown_cmark::{html, Options, Parser};
use serde::Deserialize;

static ABOUT_PAGE: &str = include_str!("../content/about.md");

#[derive(Debug, Deserialize)]
struct AboutFrontMatter {
    title: String,
    date: String,
    author: String,
}

#[derive(Debug)]
struct AboutPage {
    frontmatter: AboutFrontMatter,
    html_content: String,
}

impl AboutPage {
    fn load() -> Result<Self, Box<dyn std::error::Error>> {
        let (frontmatter, markdown) = Self::parse_frontmatter(ABOUT_PAGE)?;

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
    ) -> Result<(AboutFrontMatter, String), Box<dyn std::error::Error>> {
        let mut parts = content.splitn(3, "---");
        parts.next(); // Skip the first empty part

        let frontmatter_str = parts.next().ok_or("No frontmatter found")?;
        let markdown = parts.next().ok_or("No markdown content found")?;

        let frontmatter: AboutFrontMatter = serde_yaml::from_str(frontmatter_str)?;

        Ok((frontmatter, markdown.trim().to_string()))
    }
}

#[component]
pub fn About() -> Element {
    let mut about_page = use_signal(|| None);

    use_effect(move || {
        spawn(async move {
            match AboutPage::load() {
                Ok(page) => about_page.set(Some(page)),
                Err(e) => tracing::error!("Error loading about page: {}", e),
            }
        });
    });

    rsx! {
        div { id: "about",
            if let Some(page) = about_page.read().as_ref() {
                h1 { "{page.frontmatter.title}" }
                div { class: "about-meta", "By {page.frontmatter.author} on {page.frontmatter.date}" }
                div {
                    class: "about-content",
                    dangerous_inner_html: "{page.html_content}",
                }
            } else {
                p { "Loading about page..." }
            }
        }
    }
}
