// std

// crates
use actix_web::{web, Responder};

// local
use crate::models::{ExportRequest, NewMetricRequest};

static INDEX: &'static str = include_str!("../hawk-web/dist/index.html");

pub async fn serve_index() -> impl Responder {
    INDEX.with_header("content-type", "text/html")
}

pub async fn export(_data: web::Json<ExportRequest>) -> impl Responder {
    "Export"
}

pub async fn add_new_metric(_data: web::Json<NewMetricRequest>) -> impl Responder {
    "New metric."
}
