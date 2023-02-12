const wrapper = document.querySelector(".wrapper"),
    inputPart = document.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    weatherPart = wrapper.querySelector(".weather-part"),
    wIcon = weatherPart.querySelector("img"),
    arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=6df596078a0abfcb5207339840e6f84d`;
    fetchData();
}

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=6df596078a0abfcb5207339840e6f84d`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() => {
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { temp, feels_like, humidity } = info.main;

        if (id == 800) {
            wIcon.src = "https://t3.ftcdn.net/jpg/02/50/08/68/360_F_250086872_srlXRqANYR2IbNfIylRDc3eMO9MinjnV.jpg"; //icons/clear.svg
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "https://m.media-amazon.com/images/I/51i+4dLK+GL._AC_SL1468_.jpg"; //icons/storm.svg
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "https://thumbs.dreamstime.com/b/car-snow-passenger-under-ice-35898102.jpg"; //icons/snow.svg
        } else if (id >= 701 && id <= 781) {
            wIcon.src = " https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpH9PAtZbDw8pvfjXaqXzHAR6ubnKcSpTCWQ&usqp=CAU"; //haze
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "https://thumbs.dreamstime.com/b/overcast-glyph-icon-weather-climate-cloudy-sign-vector-graphics-solid-pattern-white-background-eps-149023379.jpg"; //cloud
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            wIcon.src = "https://png.pngtree.com/png-clipart/20201205/ourlarge/pngtree-cartoon-style-rain-cloud-png-image_2486263.jpg"; //rain
        }

        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});