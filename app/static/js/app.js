function do_dashboard() {  // THIS NEED TO BE 2 FUNCTIONS???
    // Extract user input
    let min_stars = d3.select("#min_stars_filter").property("value");
    min_stars = parseInt(min_stars);
    
    // Make url request
    let url_dashboard = `/api/v1.0/get_dashboard/${min_stars}`;
    d3.json(url_dashboard).then(function (data) {

    // Create the graphs
    make_donut(data.donut_data)
    make_table(data.table_data)
    make_map(data.map_data)
    });
}

function do_histogram() {  // THIS NEED TO BE 2 FUNCTIONS???
    // console.log('test')
    // Extract user input
    let restaurant = d3.select("#restaurant_filter").property("value");
    
    // Make url request
    let url_histogram = `/api/v1.0/get_histogram/${restaurant}`;
    d3.json(url_histogram).then(function (histogram_data) {

    // Create the histogram
    make_histogram(histogram_data)
    }).catch(function(error) {
        console.error('Error:', error);
    });;    
}


function make_donut(filtered_data) {
    // // sort values
    filtered_data.sort((a, b) => (b.popularity - a.popularity));
    // // extract data for pie chart
    let donut_data = filtered_data.map(x => x.popularity);
    let donut_labels = filtered_data.map(x => x.category_name);
    let trace1 = {
            values: donut_data,
            labels: donut_labels,
            type: 'pie',
            hoverinfo: 'label+percent+name',
            hole: 0.4,
            name: "Category Popularity"
        }
    // // Create data array
    let data = [trace1];
    // // Apply a title to the layout
    let layout = {
        title: "Popular Categories",
    }
    Plotly.newPlot("donut_chart", data, layout);
    }


function make_table(filtered_data) {
    // select table
    let table = d3.select("#data_table");
    let table_body = table.select("tbody");
    table_body.html(""); // destroy any existing rows
  
    // create table
    for (let i = 0; i < filtered_data.length; i++){
      // get data row
      let data_row = filtered_data[i];
  
      // creates new row in the table
      let row = table_body.append("tr");
      row.append("td").text(data_row.name);
      row.append("td").text(data_row.address);
      row.append("td").text(data_row.category);
      row.append("td").text(data_row.latitude);
      row.append("td").text(data_row.longitude);
      row.append("td").text(data_row.stars);
      row.append("td").text(data_row.total_reviews);
    }
  }

  function make_histogram(histogram_data) {

    console.log("Histogram Data:", histogram_data); // Log the data
    console.log("Number of Data Points:", histogram_data.length);

    // Get the selected restaurant from the filter
    let restaurant = d3.select("#restaurant_filter").property("value");

    // Define the parseDate function
    let parseDate = d3.timeParse("%Y-%m-%d");

    // Parse the date, Group by Month
    let dataByMonth = d3.group(
        histogram_data, 
        d => d3.timeMonth(parseDate(d.date))
    );

    // Lists for histogram
    const hist_x = [];
    const hist_y = [];
    const hist_text = [];

    dataByMonth.forEach((values, key) => {
        hist_x.push(key);
        let averageStars = d3.mean(values, d => d.review_stars).toFixed(1);
        hist_y.push(averageStars);
        hist_text.push(`Reviews: ${values.length}`);
    });

    // Trace for the Histogram
    let hist_trace = {
        x: hist_x,
        y: hist_y,
        type: 'bar',
        text: hist_text,
        marker: {
            color: 'rgba(100,250,100,0.7)',
            line: {
                color: 'rgba(100,250,100,1)',
                width: 1
            }
        }
    };

    const data = [hist_trace];

    const layout = {
        title: {
            text: `Average Ratings for ${restaurant}`,
            font: {
                size: 24
            }
        },
        xaxis: {
            tickangle: -45,
            tickformat: "%b %Y",
            nticks: 13
        },
        yaxis: {
            title: 'Average Review Stars',
            range: [0, 5.1]
        },
        margin: {
            l: 60,
            r: 60,
            b: 125,
            t: 70,
            pad: 4
        }
    };

    // Render plot with div tag histogram
    try {
        Plotly.newPlot("histogram", data, layout);
    } catch (error) {
        console.error("Plotly Error:", error);
    }

};

// Event Listener for Filter Click
d3.select(`#filter`).on("click", do_dashboard);
d3.select(`#filter`).on("click", do_histogram);

// Use default on first loading page
do_dashboard();
do_histogram();