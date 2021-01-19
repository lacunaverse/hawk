// std

// crates
use actix_web::{web, Responder};

// local
use crate::models::ExportRequest;

static INDEX: &'static str = include_str!("../hawk-web/dist/index.html");

pub async fn serve_index() -> impl Responder {
    INDEX.with_header("content-type", "text/html")
}

pub async fn serve_add_metric() -> impl Responder {
    "Add metric"
}

pub async fn serve_search() -> impl Responder {
    "Search"
}

pub async fn export(_data: web::Json<ExportRequest>) -> impl Responder {
    "Export"
}

pub async fn serve_log() -> impl Responder {
    "Log"
}
