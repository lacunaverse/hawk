#![feature(proc_macro_hygiene, decl_macro)]

// std

// external
use rocket::*;

fn main() {
    rocket::ignite()
        .mount(
            "/",
            rocket_contrib::serve::StaticFiles::from(concat!(env!("CARGO_MANIFEST_DIR"), "/")),
        )
        .launch();
}
