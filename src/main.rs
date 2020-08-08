// std

// crates
use actix_files::Files;
use actix_web::{middleware, web, App, HttpRequest, HttpServer, Responder};

// local
mod routes;
use routes::*;

mod models;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=info");
    pretty_env_logger::init();

    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .route("/", web::get().to(serve_index))
            .route("/view", web::get().to(serve_index))
            .route("/view/compare", web::get().to(serve_index))
            .route("/export", web::get().to(serve_index))
            .route("/export", web::post().to(export))
            .route("/metrics", web::get().to(serve_index))
            .route("/metrics/edit", web::get().to(serve_index))
            .route("/metrics/new", web::get().to(serve_index))
            .route("/metrics/new", web::post().to(add_new_metric))
            .route("/log", web::get().to(serve_index))
            .route("/search", web::get().to(serve_index))
            .route("/about", web::get().to(serve_index))
            .route("/settings", web::get().to(serve_index))
            .service(
                Files::new("/", concat!(env!("CARGO_MANIFEST_DIR"), "/hawk-web/dist"))
                    .prefer_utf8(true)
                    .show_files_listing(),
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
