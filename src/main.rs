use dioxus::{logger::tracing, prelude::*};
mod about;
mod blog;
mod post;

use about::About;
use blog::{BlogList, BlogPost};

#[derive(Debug, Clone, Routable, PartialEq)]
#[rustfmt::skip]
enum Route {
    #[layout(Navbar)]
    #[route("/")]
    Home {},
    #[route("/blog")]
    BlogList {},
    #[route("/blog/:id")]
    BlogPost { id: String },
    #[route("/about")]
    About {},
}

const FAVICON: Asset = asset!("/assets/favicon.ico");
const MAIN_CSS: Asset = asset!("/assets/main.css");
const COLORS_CSS: Asset = asset!("/assets/colors.css");
const BANNER_PNG: Asset = asset!("/assets/banner.png");
const BLOG_CSS: Asset = asset!("/assets/blog.css");
fn main() {
  // Initialize logging only in debug builds
  #[cfg(debug_assertions)]
  dioxus::logger::init(tracing::Level::DEBUG).expect("Failed to initialize logger");

  dioxus::launch(App);
}

#[component]
fn App() -> Element {
  rsx! {
      document::Link { rel: "icon", href: FAVICON }
      document::Link { rel: "stylesheet", href: MAIN_CSS }
      document::Link { rel: "stylesheet", href: BLOG_CSS }
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

/// Shared navbar component.
#[component]
fn Navbar() -> Element {
  rsx! {
      div { id: "navbar",
          Link { to: Route::Home {}, "Home" }
          Link { to: Route::BlogList {}, "Blog" }
          Link { to: Route::About {}, "About" }
      }

      Outlet::<Route> {}
  }
}
