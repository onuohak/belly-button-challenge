// Define the constant for the JSON data URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Initialize a promise for fetching JSON data
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch JSON data, log it, and store it in a variable (allData)
let allData;

d3.json(url).then(function(data) {
    console.log(data);
    allData = data;
    initDashboard();
});

// Function to retrieve metadata for a given sample
function getMetaData(sample) {
    let metadata = allData.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    let panelContent = d3.select("#sample-metadata");
    panelContent.html("");

    // Display metadata in the panel
    for (key in result) {
        panelContent.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
    }
} 

// Function to build charts based on the selected sample
function buildCharts(sample) {
    let samples = allData.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    let otuLabels = result.otu_labels;
    let otuIds = result.otu_ids;
    let sampleValues = result.sample_values;

    // Build bar graph
    yticks = otuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barLayout = {
        title: "<b>Top 10 Operational Taxonomic Units</b>",
        margin: { t: 35, l: 150 }
    };

    let barData = [
        {
            type: "bar",
            orientation: "h",
            text: otuLabels.slice(0, 10).reverse(),
            x: sampleValues.slice(0, 10).reverse(),
            y: yticks,
        }
    ];
    Plotly.newPlot("bar", barData, barLayout);

    // Build bubble chart
    let bubbleData = [
        {
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            },
            x: otuIds,
            y: sampleValues
        }
    ];

    let bubbleLayout = {
        title: "<b>Operational Taxonomic Units per Sample</b>",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU IDs" },
        margin: { t: 30 }
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
}

// Function to initialize the dashboard
function initDashboard() {
    let selector = d3.select("#selDataset");
    d3.json(url).then((data) => {
        let sampleNames = data.names;

        // Populate the dropdown with sample names
        for (let i = 0; i < sampleNames.length; i++) {
            selector
                .append("option")
                .text(sampleNames[i])
                .property("value", sampleNames[i]);
        };

        // Initialize the dashboard with the first sample
        let firstSample = sampleNames[0];
        buildCharts(firstSample);
        getMetaData(firstSample);
        buildGaugeChart(firstSample);
    });
}

// Function to update the dashboard with a new sample
function testSubject(newSample) {
    buildCharts(newSample);
    getMetaData(newSample);
    buildGaugeChart(newSample);
}

// Initialize the dashboard
initDashboard();
