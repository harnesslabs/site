use dioxus::logger::tracing;
use dioxus::prelude::*;
mod blog;
use blog::{find_post_by_id, load_all_posts, BlogPost};

#[derive(Debug, Clone, Routable, PartialEq)]
#[rustfmt::skip]
enum Route {
    #[layout(Navbar)]
    #[route("/")]
    Home {},
    #[route("/blog")]
    BlogList {},
    #[route("/blog/:id")]
    BlogPostComponent { id: String },
}

const FAVICON: Asset = asset!("/assets/favicon.ico");
const MAIN_CSS: Asset = asset!("/assets/main.css");
const COLORS_CSS: Asset = asset!("/assets/colors.css");
const BANNER_PNG: Asset = asset!("/assets/banner.png");

fn main() {
    // Initialize logging
    dioxus::logger::init(tracing::Level::DEBUG).expect("Failed to initialize logger");

    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    rsx! {
        document::Link { rel: "icon", href: FAVICON }
        document::Link { rel: "stylesheet", href: MAIN_CSS }
        document::Link { rel: "stylesheet", href: COLORS_CSS }
        Router::<Route> {}
    }
}

#[component]
pub fn Hero() -> Element {
    rsx! {
        div { id: "hero",
            h1 { style: "margin-top: 0.5em; margin-bottom: 0.2em;", "Harness Labs" }
            p { style: "max-width: 600px; font-size: 1.2em; color: var(--color-text-secondary);",
                "Harness Labs is focused on building innovative software grounded in mathematics. We believe in the power of rigorous thinking and elegant solutions to create technology that matters."
            }
            img { src: BANNER_PNG, id: "banner" }
        }
    }
}

/// Home page
#[component]
fn Home() -> Element {
    rsx! {
        Hero {}
    }
}

/// Blog listing page
#[component]
pub fn BlogList() -> Element {
    let mut posts = use_signal(|| Vec::<BlogPost>::new());

    use_effect(move || {
        spawn(async move {
            match load_all_posts().await {
                Ok(loaded_posts) => {
                    tracing::info!("Successfully loaded {} posts", loaded_posts.len());
                    posts.set(loaded_posts);
                }
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
                                to: Route::BlogPostComponent {
                                    id: post.id.clone(),
                                },
                                h2 { "{post.frontmatter.title}" }
                                div { class: "post-meta",
                                    "By {post.frontmatter.author} on {post.frontmatter.date}"
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
pub fn BlogPostComponent(id: String) -> Element {
    let mut posts = use_signal(|| Vec::<BlogPost>::new());

    use_effect(move || {
        spawn(async move {
            match load_all_posts().await {
                Ok(loaded_posts) => {
                    tracing::info!("Successfully loaded {} posts", loaded_posts.len());
                    posts.set(loaded_posts);
                }
                Err(e) => tracing::error!("Error loading posts: {}", e),
            }
        });
    });

    let post = posts.read().iter().find(|p| p.id == id).cloned();

    rsx! {
        div { id: "blog",
            if let Some(post) = post {
                h1 { "{post.frontmatter.title}" }
                div { class: "post-meta", "By {post.frontmatter.author} on {post.frontmatter.date}" }
                div {
                    class: "post-content",
                    dangerous_inner_html: "{post.html_content}",
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

/// Shared navbar component.
#[component]
fn Navbar() -> Element {
    rsx! {
        div { id: "navbar",
            Link { to: Route::Home {}, "Home" }
            Link { to: Route::BlogList {}, "Blog" }
        }

        Outlet::<Route> {}
    }
}
