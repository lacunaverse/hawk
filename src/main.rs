// std

// crates
use actix_web::{middleware, web, App, HttpRequest, HttpServer, Responder};

// local

async fn serve_index(req: HttpRequest) -> impl Responder {
    "Index"
}

async fn serve_add_metric(req: HttpRequest) -> impl Responder {
    "Add metric"
}

async fn serve_search(req: HttpRequest) -> impl Responder {
    "Search"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=info");
    pretty_env_logger::init();

    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .route("/", web::get().to(serve_index))
            .route("/new/metric", web::get().to(serve_add_metric))
            .route("/search", web::get().to(serve_search))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
