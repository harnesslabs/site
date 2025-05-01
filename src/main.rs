use dioxus::prelude::*;
mod blog;
use blog::{load_all_posts, BlogPost};

#[derive(Debug, Clone, Routable, PartialEq)]
#[rustfmt::skip]
enum Route {
    #[layout(Navbar)]
    #[route("/")]
    Home {},
    #[route("/blog/:id")]
    Blog { id: i32 },
}

const FAVICON: Asset = asset!("/assets/favicon.ico");
const MAIN_CSS: Asset = asset!("/assets/main.css");
const COLORS_CSS: Asset = asset!("/assets/colors.css");
const BANNER_PNG: Asset = asset!("/assets/banner.png");

fn main() {
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

/// Blog page
#[component]
pub fn Blog(id: i32) -> Element {
    let mut posts = use_signal(|| Vec::<BlogPost>::new());

    use_effect(move || {
        if let Ok(loaded_posts) = load_all_posts() {
            posts.set(loaded_posts);
        }
    });

    let post = posts.read().get(id as usize - 1).cloned();

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

            // Navigation links
            if id > 1 {
                Link { to: Route::Blog { id: id - 1 }, "Previous" }
                span { " | " }
            }
            Link { to: Route::Home {}, "Home" }
            if id < posts.read().len() as i32 {
                span { " | " }
                Link { to: Route::Blog { id: id + 1 }, "Next" }
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
            Link { to: Route::Blog { id: 1 }, "Blog" }
        }

        Outlet::<Route> {}
    }
}
