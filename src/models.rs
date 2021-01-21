// std

// crates
use serde::{Deserialize, Serialize};

// local

/// Type of file to export data to
#[derive(Serialize, Deserialize, Debug)]
pub enum ExportFileType {
    Json,
    Html,
}

/// Request schema for /export
#[derive(Serialize, Deserialize, Debug)]
pub struct ExportRequest {
    pub export_type: ExportFileType,
    //    pub metrics
}

/// Represents the type of a metric
#[derive(Serialize, Deserialize, Debug)]
pub enum ValueType {
    String,
    Number,
    Date,
    Boolean,
}

/// Represents the frequency a metric is supposed to be logged
#[derive(Debug, Serialize, Deserialize)]
pub enum Frequency {
    Hourly,
    Daily,
    Weekly,
    BiWeekly,
    Monthly,
    BiMonthly,
    Yearly,
    Custom(),
}

/// Request schema for /metrics/new
#[derive(Serialize, Deserialize, Debug)]
pub struct NewMetricRequest {
    /// The name of the metric
    pub name: String,
    /// Optional description of the metric
    pub description: Option<String>,
    /// The type of the metric
    pub value_type: ValueType,
    /// The frequency for logging
    pub frequency: Frequency,
}
