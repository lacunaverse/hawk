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
	/// Frequency of logging
	Frequency Frequency `json:"frequency"`
	/// Unix time stamp when initialized
	Initialised int64 `json:"initialised"`
	/// Time since item was last logged
	LastLog int64 `json:"lastLog"`
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

	present, err := MetricIsPresentInLog(metric.Name)
	if err != nil {
		return false, err
	}

	_, err = WriteMetric(data)

	if !present {
		AddMetricToLog(metric.Name)
	}

	if err != nil {
		return false, err
	}

	return true, nil
}

type Record struct {
	Value    string `json:"value"`
	StoredAt int64  `json:"storedAt"`
}

type RecordList struct {
	Name string   `json:"name"`
	Logs []Record `json:"logs"`
}

type RecordStore struct {
	Records []RecordList `json:"records"`
}

func AddMetricToLog(metric string) (bool, error) {
	data, err := OpenLog()
	if err != nil {
		return false, err
	}

	data.Records = append(data.Records, RecordList{Name: metric, Logs: []Record{}})

	_, err = WriteLog(data)

	if err != nil {
		return false, err
	}

	return true, nil
}

func WriteLog(data RecordStore) (bool, error) {
	json, err := json.Marshal(data)

	if err != nil {
		return false, err
	}

	err = ioutil.WriteFile("./logs.json", json, 0644)

	if err != nil {
		return false, err
	}

	return true, nil
}

func MetricIsPresentInLog(metric string) (bool, error) {
	data, err := OpenLog()

	if err != nil {
		return false, err
	}

	for _, x := range data.Records {
		if x.Name == metric {
			return true, nil
		}
	}

	return false, nil
}

func OpenLog() (RecordStore, error) {
	data, err := ioutil.ReadFile("./logs.json")

	if err != nil {
		return RecordStore{}, err
	}

	var records RecordStore

	err = json.Unmarshal(data, &records)
	if err != nil {
		return RecordStore{}, err
	}

	return records, nil
}

func SaveLog(metrics []PartialMetric) (bool, error) {
	store, err := OpenLog()

	if err != nil {
		return false, fmt.Errorf("failed to read storage")
	}

	for _, metric := range metrics {
		for _, item := range store.Records {
			if item.Name == metric.Name {
				item.Logs = append(item.Logs, Record{Value: metric.UpdatedValue, StoredAt: time.Now().Unix()})
			}
		}
	}

	metricsToUpdate, err := OpenMetricStore()
	if err != nil {
		return false, fmt.Errorf("failed to save last log time")
	}

	for _, metric := range metrics {
		for _, item := range metricsToUpdate.Metrics {
			if item.Name == metric.Name {
				item.LastLog = time.Now().Unix()
			}
		}
	}

	return true, nil
}

func GetLog(log string) (RecordList, error) {
	data, err := OpenLog()

	if err != nil {
		return RecordList{}, err
	}

	for _, item := range data.Records {
		if item.Name == log {
			return item, nil
		}
	}

	return RecordList{}, fmt.Errorf("not found")
}

/// Bootstraps storage
func Init() {
	inits := []string{`{"metrics": []}`, `{"records": []}`}

	for idx, x := range []string{"./metrics.json", "./logs.json"} {
		if _, err := os.Stat(x); os.IsNotExist(err) {
			ioutil.WriteFile(x, []byte(inits[idx]), 0644)
		} else if data, _ := ioutil.ReadFile(x); len(data) == 0 {
			ioutil.WriteFile(x, []byte(inits[idx]), 0644)
		}
	}
}
