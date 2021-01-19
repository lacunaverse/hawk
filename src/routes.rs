// std

// crates
use actix_web::{web, Responder};

// local
use crate::models::ExportRequest;

static INDEX: &'static str = include_str!("../hawk-web/dist/index.html");

pub async fn serve_index() -> impl Responder {
    INDEX.with_header("content-type", "text/html")
}

pub async fn export(_data: web::Json<ExportRequest>) -> impl Responder {
    "Export"
}
