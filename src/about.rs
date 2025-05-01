use super::*;
use crate::post::MarkdownContent;

static ABOUT_PAGE: &str = include_str!("../content/about.md");

#[derive(Debug)]
struct AboutPage {
    content: MarkdownContent,
}

impl AboutPage {
    fn load() -> Result<Self, Box<dyn std::error::Error>> {
        let content = MarkdownContent::from_markdown(ABOUT_PAGE)?;
        Ok(Self { content })
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
                h1 { "{page.content.frontmatter.title}" }
                div { class: "about-meta",
                    "By {page.content.frontmatter.author} on {page.content.frontmatter.date}"
                }
                div {
                    class: "about-content",
                    dangerous_inner_html: "{page.content.html_content}",
                }
            } else {
                p { "Loading about page..." }
            }
        }
    }
}
