# hawk

get a bird's eye view of you

a tool for [quantified-self](https://en.wikipedia.org/wiki/Quantified_self)

Hawk is a tool to log data about yourself and make informed decisions off of it.

## Roadmap

+ main API
  + postgres
+ main functionality
+ exporting data
+ viewing data
  + data diffing (variance between intervals)
  + comparisons, ranges
+ find file-watching solution for `hawk-web` builds

## Setup

### Development

Requirements:

+ [npm](https://www.npmjs.com/)
+ [`cargo` + `rustc`](https://rustup.rs/)

Running:

In one terminal:

+ navigate to the `hawk-web/` directory
+ run `npm run build`

In another terminal:

+ run `cargo run`

## Terminology

### Logs

Logs are an instance of a metric. They describe a single datapoint in a category (metric). For instance:

+ how far did I run on 2020.10.09?
+ how long did I sleep on 2020.10.09?

Together, logs form collections of data which can be used to create inferences and goals.

### Metrics

Metrics are a statistic, to describe a category to log. For instance:

+ weight
+ distance ran
+ minutes slept

They have three criteria:

+ a name, to describe the metric
+ a type, to represent acceptable values for the metric
  + can be a true/false value, number, or text
+ a frequency, to determine how often a metric should be logged (daily, monthly, etc.)

## Credits

+ [Heroicons](https://heroicons.dev/?query=data)
