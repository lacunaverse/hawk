package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
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

type Metric struct {
	Name      string
	Type      MetricType
	Frequency Frequency
	/// Unix time stamp when initialized
	Initialised int64
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
		if item.Name == metric.Name {
			metric = item
			exists = true
			break
		}
	}

	if exists {
		return metric, nil
	} else {
		return Metric{}, nil
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
	_, err := ioutil.ReadFile("./metrics.json")

	if err != nil {

	}
}
