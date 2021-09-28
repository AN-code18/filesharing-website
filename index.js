const dropzone = document.querySelector(".drop-zone ");
const fileinput = document.querySelector("#fileinput");
const browseBtn = document.querySelector(".browseBtn");
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressContainer = document.querySelector(".progress-container");
const fileURL = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copyBTN");
const emailForm = document.querySelector("#emailForm");
const alert = document.querySelector(".alert");

const maxAllowedSize = 100 * 1024 * 1024; //100MB

const host = "https://inshare-tt.herokuapp.com/"
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

dropzone.addEventListener("dragover", (e) => {
    e.preventDefault()

    if (!dropzone.classList.contains("dragged")) {
        dropzone.classList.add("dragged");
    }
});

dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragged");
});

dropzone.addEventListener("drop", (e) => {
    e.preventDefault()
    dropzone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    console.log(files);
    if (files.length) {
        fileinput.files = files;
        uploadFile();
    }
});


fileinput.addEventListener("change", () => {
    uploadFile()
})

browseBtn.addEventListener("click", () => {
    fileinput.click()
})

copyBtn.addEventListener("click", () => {
    fileURL.select();
    Document.execCommand("copy");
    showAlert("Link Copied")
});


emailForm.addEventListener("submit", (e) => {
    e.preventDefault()
    //console.log("submit form")
    const url = (fileURL.value);

    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value
    };
    emailForm[2].setAttribute("disabled", "true");
    console.table(formData);


    fetch(emailURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    }).then(res => res.JSON())
        .then(sucess => {
            if (sucess) {
                sharingContainer.style.display = "none";
                showAlert("Email Sent")
            }
        })

})


const uploadFile = () => {
    if (fileinput.files.length > 1) {
        fileinput.value = "";
        showAlert("Only upload one file at a time!")
        return;
    }
    const file = fileinput.files[0];

    if (file.size > maxAllowedSize) {
        showAlert("File size is more!")
        fileinput.value = "";
        return;
    }
    progressContainer.style.display = "block";

    const formData = new FormData();
    formData.append("myfile ", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response));

        }
    };

    xhr.upload.onprogress = updateProgress;
    xhr.upload.onerror = () => {
        fileinput.value = "";
        showAlert(`Error in upload: ${xhr.statusText}`)
    }

    xhr.open("POST", uploadURL);
    xhr.send(formData);
};

const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    //console.log(percent);
    bgProgress.style.width = `${percent}`;
    percentDiv.innerText = percent;
}

const showLink = ({ file: url }) => {
    console.log(url);
    fileinput.value = "";
    emailForm[2].removeAttribute("disabled");
    progressContainer.style.display = "none";
    sharingContainer.style.display = "block";
    fileURL.value = url;
}
let alertTimer;
const showAlert = (msg) => {
    alert.innerText = msg;
    alert.style.transform = "translate(-50% , 0)";
    clearTimeout(alertTimer);

    alertTimer = setTimeout(() => {
        alert.style.transform = "translate(-50% , 60px)";
    }, 2000)
}