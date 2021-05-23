package main

import (
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// Templates
type Templates struct {
	index   *template.Template
	metrics *template.Template
	errors  *template.Template
}

func (t *Templates) Render(w io.Writer, name string, data interface{}, cat string) error {
	switch cat {
	case "index":
		return t.index.ExecuteTemplate(w, name, data)
	case "errors":
		return t.errors.ExecuteTemplate(w, name, data)
	case "metrics":
		return t.metrics.ExecuteTemplate(w, name, data)
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
	index:   template.Must(template.ParseFiles("views/layout.html", "views/index.html", "views/layouts/nav.html")),
	metrics: template.Must(template.ParseFiles("views/layout.html", "views/metrics/index.html", "views/layouts/nav.html")),
	errors:  template.Must(template.ParseFiles("views/layout.html", "views/errors/404.html", "views/layouts/nav.html")),
}

func Metrics(w http.ResponseWriter, r *http.Request) {
	t.Render(w, "index.html", "", "metrics")
}

/// Index template data
type IndexData struct {
	Date string
}

// Index root route
func Index(w http.ResponseWriter, r *http.Request) {
	time := time.Now()
	weekday := time.Weekday()
	month := time.Month()
	day := time.Day()

	date := fmt.Sprintf("%s, %v %s", weekday, day, month)

	t.Render(w, "index.html", IndexData{Date: date}, "index")
}

func main() {
	r := mux.NewRouter()

	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/dist")))).Methods("GET")

	r.HandleFunc("/", Index).Methods("GET")
	r.HandleFunc("/metrics", Metrics).Methods("GET")
	r.HandleFunc("/export", Metrics).Methods("GET")
	r.HandleFunc("/export", Metrics).Methods("POST")

	r.NotFoundHandler = NotFound{}
	log.Fatal(http.ListenAndServe(":8000", r))
}
