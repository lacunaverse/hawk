package main

import (
	"encoding/json"
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
	index       *template.Template
	metrics     *template.Template
	editMetrics *template.Template
	errors      *template.Template
}

func (t *Templates) Render(w io.Writer, name string, data interface{}, cat string) error {
	switch cat {
	case "index":
		return t.index.ExecuteTemplate(w, name, data)
	case "errors":
		return t.errors.ExecuteTemplate(w, name, data)
	case "metrics":
		return t.metrics.ExecuteTemplate(w, name, data)
	case "editMetrics":
		return t.editMetrics.ExecuteTemplate(w, name, data)
	default:
		return t.errors.ExecuteTemplate(w, name, data)
	}
}

type NotFound struct {
}

func (n NotFound) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(404)
	t.Render(w, "404.html", "", "errors")
}

var t = &Templates{
	index:       template.Must(template.ParseFiles("views/layout.html", "views/index.html", "views/layouts/nav.html")),
	metrics:     template.Must(template.ParseFiles("views/layout.html", "views/metrics/index.html", "views/layouts/nav.html")),
	editMetrics: template.Must(template.ParseFiles("views/layout.html", "views/metrics/edit.html", "views/layouts/nav.html")),
	errors:      template.Must(template.ParseFiles("views/layout.html", "views/errors/404.html", "views/layouts/nav.html")),
}

func NewMetric(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var t Metric
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&t)

	t.Initialised = time.Now().Unix()

	_, err := SaveMetric(t)
	if err != nil {
		// todo: better error responses
		switch err.Error() {
		case "already exists":
			w.WriteHeader(http.StatusConflict)
		default:
			w.WriteHeader(http.StatusInternalServerError)
		}

		fmt.Fprintf(w, `{"status":"write failed"}`)
	} else {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status": "ok"}`)
	}
}

type EditMetricResponse struct {
	Metric Metric
	Error  string
}

func EditMetric(w http.ResponseWriter, r *http.Request) {
	metric, err := GetMetric(mux.Vars(r)["name"])

	if err != nil {
		t.Render(w, "edit.html", EditMetricResponse{Error: "Couldn't load your metrics at the moment."}, "editMetrics")
		return
	}

	if len(metric.Name) == 0 {
		w.WriteHeader(404)
		t.Render(w, "404.html", "", "errors")

		return
	}

	t.Render(w, "edit.html", EditMetricResponse{Metric: metric}, "editMetrics")
}

type MetricResponse struct {
	Metrics MetricList
	Error   string
}

func Metrics(w http.ResponseWriter, r *http.Request) {
	metrics, err := OpenMetricStore()

	if err != nil {
		t.Render(w, "index.html", MetricResponse{Error: "Couldn't load your metrics at the moment."}, "metrics")
		return
	}

	if len(metrics.Metrics) == 0 {
		t.Render(w, "index.html", MetricResponse{Error: "You don't have any metrics at the moment. Try creating some using the form below."}, "metrics")
		return
	}

	t.Render(w, "index.html", MetricResponse{Metrics: metrics}, "metrics")
}

/// Index template data
type IndexData struct {
	Date         string
	NeedsLogging []Metric
	Error        string
}

// Index root route
func Index(w http.ResponseWriter, r *http.Request) {
	time := time.Now()
	weekday := time.Weekday()
	month := time.Month()
	day := time.Day()

	date := fmt.Sprintf("%s, %v %s", weekday, day, month)

	metrics, err := OpenMetricStore()

	if err != nil {
		t.Render(w, "index.html", IndexData{Date: date, Error: "Failed to get metrics that need logging."}, "index")
	}

	var needsLogging []Metric

	for _, item := range metrics.Metrics {
		var duration FrequencySeconds
		switch item.Frequency {
		case "daily":
			duration = DailySeconds
		case "weekly":
			duration = WeeklySeconds
		case "biweekly":
			duration = BiweeklySeconds
		case "monthly":
			duration = MonthlySeconds
		case "yearly":
			duration = YearlySeconds
		}

		if (time.Unix() - item.LastLog) >= int64(duration) {
			needsLogging = append(needsLogging, item)
		}
	}

	t.Render(w, "index.html", IndexData{Date: date, NeedsLogging: needsLogging}, "index")
}

func main() {
	Init()

	r := mux.NewRouter()

	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/dist")))).Methods("GET")

	r.HandleFunc("/", Index).Methods("GET")
	r.HandleFunc("/metrics", Metrics).Methods("GET")
	r.HandleFunc("/metrics/new", NewMetric).Methods("POST")
	r.HandleFunc("/metrics/edit/{name}", EditMetric).Methods("GET")
	r.HandleFunc("/export", Metrics).Methods("GET")
	r.HandleFunc("/export", Metrics).Methods("POST")

	r.NotFoundHandler = NotFound{}
	log.Fatal(http.ListenAndServe(":8000", r))
}
