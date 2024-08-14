function do_restaurant() {  
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


function make_restaurant(restaurant_data) {

    console.log("Restaurant Data:", restaurant_data); // Log the data
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
d3.select("#restaurant_filter").on("click", do_restaurant);

// Use default on first loading page
do_restaurant();

