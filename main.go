package main

import (
	"html/template"
	"io"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// Templates
type Templates struct {
	index  *template.Template
	errors *template.Template
}

func (t *Templates) Render(w io.Writer, name string, data interface{}, cat string) error {
	switch cat {
	case "index":
		return t.index.ExecuteTemplate(w, name, data)
	case "errors":
		return t.errors.ExecuteTemplate(w, name, data)
	default:
		return t.errors.ExecuteTemplate(w, name, data)
	}
}

type NotFound struct {
}

func (n NotFound) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	t.Render(w, "404.html", "", "errors")
}

var t = &Templates{
	index:  template.Must(template.ParseFiles("views/layout.html", "views/index.html", "views/layouts/nav.html")),
	errors: template.Must(template.ParseFiles("views/errors/404.html")),
}

// Index root route
func Index(w http.ResponseWriter, r *http.Request) {
	t.Render(w, "layout.html", "", "index")
}

func main() {
	r := mux.NewRouter()

	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/dist")))).Methods("GET")

	r.HandleFunc("/", Index).Methods("GET")

	r.NotFoundHandler = NotFound{}
	log.Fatal(http.ListenAndServe(":8000", r))
}
