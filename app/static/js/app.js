function do_both() {
    // Check for min_stars_filter => run if so
    if (document.getElementById("filter")) {
        let min_stars = d3.select("#filter").property("value");
        min_stars = parseInt(min_stars);

        // Make URL request for dashboard
        let url_dashboard = `/api/v1.0/get_dashboard/${min_stars}`;
        d3.json(url_dashboard).then(function (data) {
            
            // Create the graphs
            make_donut(data.donut_data);
            make_table(data.table_data);
            make_map(data.map_data);
        }).catch(function(error) {
            console.error('Error:', error);
        });
    }

    // Check for restaurant_filter => run if so
    if (document.getElementById("restaurant_filter")) {
        let restaurant = d3.select("#restaurant_filter").property("value");

        // Modify URL based on "All" selection
        let url_restaurant = restaurant === "All" ? `/api/v1.0/get_restaurant` : `/api/v1.0/get_restaurant/${restaurant}`;

        // Make URL request for restaurant
        d3.json(url_restaurant).then(function (restaurant_data) {
            make_restaurant(restaurant_data);
        }).catch(function(error) {
            console.error('Error:', error);
        });
    }
}

function do_dashboard() {  // THIS NEED TO BE 2 FUNCTIONS???
    // Extract user input
    let min_stars = d3.select("#filter").property("value");
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

function do_restaurant() {  // THIS NEED TO BE 2 FUNCTIONS???
    // console.log('test')
    // Extract user input
    let restaurant = d3.select("#restaurant_filter").property("value");
    
    // Make url request
    let url_restaurant = `/api/v1.0/get_restaurant/${restaurant}`;
    d3.json(url_restaurant).then(function (restaurant_data) {

    // Create the restaurant
    make_restaurant(restaurant_data)
    }).catch(function(error) {
        console.error('Error:', error);
    });;    
}


function make_donut(filtered_data) {
    console.log(filtered_data)
    
    let top_5_data = filtered_data.sort((a, b) => b.count - a.count).slice(0, 5);

    // Extract the count and categories from the top 10 data array
    let donut_data = top_5_data.map(x => x.count);
    let donut_labels = top_5_data.map(x => x.categories);
        
    let trace1 = {
            values: donut_data,
            labels: donut_labels,
            type: 'pie',
            hoverinfo: 'label+percent',
            hole: 0.4,
            name: "Category Popularity"
        }
    // // Create data array
    let data = [trace1];
    // // Apply a title to the layout
    let layout = {
        title: "Popular Food Groups",
        
    }
    Plotly.newPlot("donut_chart", data, layout);
    }


function make_table(filtered_data) {
    // select table
    $('#data_table').DataTable().clear().destroy();

    let table = d3.select("#data_table");
    let table_body = table.select("tbody");
    table_body.html(""); 
  
    // create table
    for (let i = 0; i < filtered_data.length; i++){
      // get data row
      let data_row = filtered_data[i];
  
      // creates new row in the table
      let row = table_body.append("tr");
      row.append("td").text(data_row.name);
      row.append("td").text(data_row.address);
      row.append("td").text(data_row.category);
      row.append("td").text(data_row.stars);
      row.append("td").text(data_row.total_reviews);
    }

    $('#data_table').DataTable();
  }

  function make_restaurant(restaurant_data) {

    console.log("restaurant Data:", restaurant_data); // Log the data
    console.log("Number of Data Points:", restaurant_data.length);

    // Get the selected restaurant from the filter
    let restaurant = d3.select("#restaurant_filter").property("value");

    // Define the parseDate function
    let parseDate = d3.timeParse("%Y-%m-%d");

    // Parse the date, Group by Month
    let dataByMonth = d3.group(
        restaurant_data, 
        d => d3.timeMonth(parseDate(d.date))
    );

    // Lists for restaurant
    const hist_x = [];
    const hist_y = [];
    const hist_text = [];

    dataByMonth.forEach((values, key) => {
        hist_x.push(key);
        let averageStars = d3.mean(values, d => d.review_stars).toFixed(1);
        hist_y.push(averageStars);
        hist_text.push(`Reviews: ${values.length}`);
    });

    // Trace for the restaurant
    let hist_trace = {
        x: hist_x,
        y: hist_y,
        type: 'bar',
        text: hist_text,
        marker: {
            color: 'rgba(253, 184, 39, 1)',
            line: {
                color: 'rgba(253, 184, 39, 1)',
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

    // Render plot with div tag restaurant
    try {
        Plotly.newPlot("restaurant", data, layout);
    } catch (error) {
        console.error("Plotly Error:", error);
    }

};

// Event Listener for Filter Click

d3.select("#filter").on("click", do_dashboard);
d3.select("#restaurant_filter").on("click", do_restaurant);



// Use default on first loading page
do_both();
// do_dashboard();
// do_restaurant();

