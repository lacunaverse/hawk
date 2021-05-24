package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"time"
)

type MetricType string

const (
	Text    MetricType = "text"
	Boolean MetricType = "boolean"
	Number  MetricType = "number"
)

type Frequency string

const (
	Daily    Frequency = "daily"
	Weekly   Frequency = "weekly"
	Biweekly Frequency = "biweekly"
	Monthly  Frequency = "monthly"
	Yearly   Frequency = "yearly"
)

type FrequencySeconds uint64

const (
	// actual value is 86400, 1 is used for testing
	DailySeconds    FrequencySeconds = 1
	WeeklySeconds   FrequencySeconds = 604800
	BiweeklySeconds FrequencySeconds = 1209600
	// assuming 30 days in a month
	MonthlySeconds FrequencySeconds = 2592000
	// 365.2425 days
	YearlySeconds FrequencySeconds = 31556952
)

type Metric struct {
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Type        MetricType `json:"type"`
	Frequency   Frequency  `json:"frequency"`
	/// Unix time stamp when initialized
	Initialised int64 `json:"initialised"`
	LastLog     int64 `json:"lastLog"`
}

type MetricList struct {
	Metrics []Metric `json:"metrics"`
}

func OpenMetricStore() (MetricList, error) {
	data, err := ioutil.ReadFile("./metrics.json")

	if err != nil {
		return MetricList{}, err
	}

	var metrics MetricList

	err = json.Unmarshal(data, &metrics)
	if err != nil {
		return MetricList{}, err
	}

	return metrics, nil
}

func GetMetric(name string) (Metric, error) {
	data, err := OpenMetricStore()

	if err != nil {
		return Metric{}, fmt.Errorf("failed to open file")
	}

	var metric Metric
	var exists bool
	for _, item := range data.Metrics {
		if item.Name == name {
			metric = item
			exists = true
			break
		}
	}

	if exists {
		return metric, nil
	} else {
		return Metric{}, fmt.Errorf("not found")
	}
}

func WriteMetric(data MetricList) (bool, error) {
	json, err := json.Marshal(data)

	if err != nil {
		return false, err
	}

	err = ioutil.WriteFile("./metrics.json", json, 0644)

	if err != nil {
		return false, err
	}

	return true, nil
}

func SaveMetric(metric Metric) (bool, error) {
	data, err := OpenMetricStore()

	if err != nil {
		return false, fmt.Errorf("failed to open file")
	}

	var exists bool
	for _, item := range data.Metrics {
		if item.Name == metric.Name {
			exists = true
			break
		}
	}

	if exists {
		return false, fmt.Errorf("already exists")
	}

	metric.LastLog = time.Now().Unix()

	data.Metrics = append(data.Metrics, metric)

	_, err = WriteMetric(data)

	if err != nil {
		return false, err
	}

	return true, nil
}

func SaveLog() {

}

/// Bootstraps storage
/// unimplemented at the moment
/// todo: implement
func Init() {
	inits := []string{`{"metrics": []}`, `{}`}

	for idx, x := range []string{"./metrics.json", "./logs.json"} {
		if _, err := os.Stat(x); os.IsNotExist(err) {
			ioutil.WriteFile(x, []byte(inits[idx]), 0644)
		} else if data, _ := ioutil.ReadFile(x); len(data) == 0 {
			ioutil.WriteFile(x, []byte(inits[idx]), 0644)
		}
	}
}
