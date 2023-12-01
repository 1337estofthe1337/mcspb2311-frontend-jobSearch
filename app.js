// api id&key
const api = {
    id: 'app_id=e7b64108',
    key: 'app_key=abd49ecf0971e54d1ce59cf3e232ae09'
}

// List of parameters after v1/api/jobs/
const country = {
    gb: 'gb', // United Kingdom
    us: 'us', // United States
    at: 'at', // Austria
    au: 'au', // Australia
    be: 'be', // Belgium
    br: 'br', // Brazil
    ca: 'ca', // Canada
    ch: 'ch', // Switzerland
    de: 'de', // Germany
    es: 'es', // Spain
    fr: 'fr', // France
    in: 'in', // India
    it: 'it', // Italy
    mx: 'mx', // Mexico
    nl: 'nl', // Netherlands
    nz: 'nz', // New Zealand
    pl: 'pl', // Poland
    sg: 'sg', // Singapore
    za: 'za', // South Africa
}

/*

List of parameters after v1/api/jobs/country/

Adzuna::API::Response::Categories {
results (array[Adzuna::API::Response::Category]): An array of all the categories discovered as Adzuna::API::Response::Category objects.
}

Adzuna::API::Response::Category {
tag (string): The string which should be passed to search endpoint using the "category" query parameter.,
label (string): A text string describing the category, suitable for display.
}

*/
const categories = {
    accountingFinanceJobs: 'accounting-finance-jobs',
    itJobs: 'it-jobs',
    salesJobs: 'sales-jobs',
    customerServicesJobs: 'customer-services-jobs',
    engineeringJobs: 'engineering-jobs',
    hrJobs: 'hr-jobs',
    healthcareNursingJobs: 'healthcare-nursing-jobs',
    hospitalityCateringJobs: 'hospitality-catering-jobs',
    prAdvertisingMarketingJobs: 'pr-advertising-marketing-jobs',
    logisticsWarehouseJobs: 'logistics-warehouse-jobs',
    teachingJobs: 'teaching-jobs',
    tradeConstructionJobs: 'trade-construction-jobs',
    adminJobs: 'admin-jobs',
    legalJobs: 'legal-jobs',
    creativeDesignJobs: 'creative-design-jobs',
    graduateJobs: 'graduate-jobs',
    retailJobs: 'retail-jobs',
    consultancyJobs: 'consultancy-jobs',
    manufacturingJobs: 'manufacturing-jobs',
    scientificQaJobs: 'scientific-qa-jobs',
    socialWorkJobs: 'social-work-jobs',
    travelJobs: 'travel-jobs',
    energyOilGasJobs: 'energy-oil-gas-jobs',
    propertyJobs: 'property-jobs',
    charityVoluntaryJobs: 'charity-voluntary-jobs',
    domesticHelpCleaningJobs: 'domestic-help-cleaning-jobs',
    maintenanceJobs: 'maintenance-jobs',
    partTimeJobs: 'part-time-jobs',
    otherGeneralJobs: 'other-general-jobs',
    unknown: 'unknown'
};


/*

Adzuna::API::Response::SalaryHistogram {
histogram (undefined, optional): The distribution of jobs by salary.
Returns an array of salaries and the number of live jobs pay as much or more than each salary.
}

*/
var histogram; // extra

/*

Adzuna::API::Response::TopCompanies {
leaderboard (array[Adzuna::API::Response::Company], optional): A list of companies, ordered by the number of jobs they are advertising. Only companies in Adzunaâs index will show up in these results. To suggest an addition to this index please email: info [at] adzuna [dot] com
}

Adzuna::API::Response::Company {
count (integer, optional): The total number of job advertisements posted by this company. Only provided for statistics queries.,
canonical_name (string, optional): A normalised string of the company name.,
average_salary (number, optional): The average salary in job advertisements posted by this company. Only provided for statistics queries.,
display_name (string, optional): The name of the company, in the form provided by the advertiser.
}

*/
var topCompanies; // extra

/*

Adzuna::API::Response::JobGeoData {
locations (array[Adzuna::API::Response::LocationJobs], optional): The number of live job ads in any given location, followed by a list of sub-locations and the number of live jobs in each of them, ordered from most jobs to least. Locations with 0 jobs are not returned.
}

Adzuna::API::Response::LocationJobs {
count (integer, optional): The number of jobs advertised at this location.,
location (Adzuna::API::Response::Location, optional): The location being described.
}

Adzuna::API::Response::Location {
area (array[string], optional): A description of the location, as an array of strings, each refining the location more than the previous.,
display_name (string, optional): A human readable name for the location.
}

*/
var geodata; // extra

/*

Adzuna::API::Response::HistoricalSalary {
month (undefined, optional): A series of average salary values, by month, for all jobs with a given category, title and/or location. This is only available for locations with significant numbers (20 or more) of jobs. Dates are formatted as ISO 8601 month/year. Salaries are given in local currency.
}

*/
var history; // extra

var page = 1; // event listener to go to next page

// this part of the URL doesn't change
const beginningURL = `https://api.adzuna.com/v1/api/jobs/`;

var url = `${beginningURL}${country.us}/search/${page}?${api.id}&${api.key}&results_per_page=50`;

function onRequest(setURL) {

    $.get(setURL, (data) => {
        
        console.log(data.results);
        console.log(`page number = ${page}`);
        console.log(setURL);

        $('#job-results').empty();

        for (let jobIndex = 0; jobIndex < data.results.length; ++jobIndex) {

            // I know this part works
            const companyName = data.results[jobIndex].company.display_name;

            if (data.results[jobIndex].salary_min === undefined) {
                let salary = '';
            }
            else if (data.results[jobIndex].salary_min === data.results[jobIndex].salary_max) {
                salary = (data.results[jobIndex].salary_min).toLocaleString("en-US");
            }
            else {
                let salary = `${(data.results[jobIndex].salary_min).toLocaleString("en-US")} - ${(data.results[jobIndex].salary_max).toLocaleString("en-US")}`;
            }

            let contractTime = data.results[jobIndex].contract_time;
            if (contractTime === 'full_time') {
                contractTime = 'Full-time';
            }
            else if (contractTime === 'part_time') {
                contractTime = 'Part-time';
            }
            else {
                contractTime = ``;
            }
            const department = data.results[jobIndex].category.label;
            const jobTitle = data.results[jobIndex].title;
            const jobDescription = data.results[jobIndex].description;
            const link = data.results[jobIndex].redirect_url;

            // need to make a variable that holds the dom elements before appending
            const $span = $('<span></span>').attr('class', 'job').css({
                "display": "block",
                "border": "2px solid black",
                "box-sizing": "border-box",
                "padding": "4px",
                "width": "80vw",
                "height": "fit-content",
                "margin": "10px"
            });
            const $spanh2 = $('<h2></h2>').attr('class', 'company-name').text(companyName);
            const $spanh4 = $('<h4></h4>').attr('class', 'department').text(`${contractTime}  |  $${salary}  |  ${department}`);
            const $spanh3 = $('<h3></h3>').attr('class', 'job-title').text(jobTitle);
            const $spandiv = $('<div></div>').attr('class', 'job-description').text(jobDescription);
            const $spana = $('<a></a>').attr({
                'href': link,
                'target': '_blank'
            }).text('Read More');
            
            $span.append($spanh2).append($spanh4).append($spanh3).append($spandiv).append($spana);
            
            $('#job-results').append($span);
        }

        
        let $previousButton = $('<a></a>').attr({
            'href': '#',
            'class': 'previous'
        }).text('Previous').css({
            "display": "inline-block",
            "padding": "8px 16px",
            "float": "left",
            "width": "39%"
        })
        
        let $nextButton = $('<a></a>').attr({
            'href': '#',
            'class': 'next'
        }).text('Next').css({
            "display": "inline-block",
            "padding": "8px 16px",
            "float": "left",
            "width": "39%"
        })
        
        $('#job-results').append($previousButton);
        $('#job-results').append($nextButton);
        
        $('.previous').on("click", () => {
            if (page === 1) {
                return;
            }
        });
        
        $('.next').on("click", () => {
            page += 1;
            let search = $('input').val().split(' ').join('%20');

            let category = $('select').val();

            if (category === "no-selection") {
                category = '';
            }

            var url = `${beginningURL}${country.us}/search/${page}?${api.id}&${api.key}&results_per_page=50&what=${search}&category=${category}`;
            onRequest(url);
        });
    })
}

// testing
var onSubmit = $('#submit').on('click', (e) => {
    e.preventDefault();
    page = 1;
    // Gets user input as string and places %20 between multiple words (URL requires this)
    let search = $('input').val().split(' ').join('%20');

    let category = $('select').val();

    if (category === "no-selection") {
        category = '';
    }

    var url = `${beginningURL}${country.us}/search/${page}?${api.id}&${api.key}&results_per_page=50&what=${search}&category=${category}`;

    onRequest(url);
})
        
onRequest(url);

function makeGraph() {
    var container;
    var labels;
}