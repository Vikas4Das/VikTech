function openNav() {
    document.getElementById("sideNav").style.right = "0";
}

function closeNav() {
    document.getElementById("sideNav").style.right = "-250px";
}

document.addEventListener("click", function(event) {
    var sideNav = document.getElementById("sideNav");
    var menuIcon = document.querySelector(".menu-icon");
    if (!sideNav.contains(event.target) && !menuIcon.contains(event.target)) {
        closeNav();
    }
});

function toggleEditor() {
    const lang = document.getElementById("language").value;
    if (lang === "html") {
        document.getElementById("frontend-editors").style.display = "block";
        document.getElementById("backend-editor").style.display = "none";
    } else {
        document.getElementById("frontend-editors").style.display = "none";
        document.getElementById("backend-editor").style.display = "block";
    }
}

function updateOutput() {
    const htmlCode = document.getElementById("html-code").value;
    const cssCode = document.getElementById("css-code").value;
    const jsCode = document.getElementById("js-code").value;

    const output = document.getElementById("output").contentWindow.document;
    output.open();
    output.write(
        `<html><head><style>${cssCode}</style></head><body>${htmlCode}<script>${jsCode}<\/script></body></html>`
    );
    output.close();
}

async function runCode() {
    const language = document.getElementById("language").value;
    const code = document.getElementById("code-input").value;
    const outputBox = document.getElementById("code-output");
    const languageMap = {
        "python": "python",
        "java": "java",
        "c": "c",
        "cpp": "cpp"
    };

    if (!languageMap[language]) {
        outputBox.innerText = "Unsupported language!";
        return;
    }

    try {
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: languageMap[language],
                version: "*",
                files: [{ name: "main", content: code }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.run && result.run.stdout) {
            outputBox.innerText = result.run.stdout;
        } else if (result.run && result.run.stderr) {
            outputBox.innerText = "Error: " + result.run.stderr;
        } else {
            outputBox.innerText = "No output received!";
        }
    } catch (error) {
        outputBox.innerText = "Execution failed! See console for details.";
        console.error("Execution Error:", error);
    }
}


let index = 0;
const testimonials = document.querySelectorAll(".testimonial-box");

function showTestimonial(n) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = (i === n) ? "block" : "none";
    });
}

function prevTestimonial() {
    index = (index - 1 + testimonials.length) % testimonials.length;
    showTestimonial(index);
}

function nextTestimonial() {
    index = (index + 1) % testimonials.length;
    showTestimonial(index);
}

showTestimonial(index);


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); 

        const targetId = this.getAttribute('href').substring(1); 
        const targetElement = document.getElementById(targetId); 

        if (targetElement) {
            const offset = 90; 
            const targetPosition = targetElement.offsetTop - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});



function openCertificateForm(course) {
    document.getElementById("certificateModal").style.display = "flex";
    document.getElementById("courseName").value = course;
}

function closeCertificateForm() {
    document.getElementById("certificateModal").style.display = "none";
}

function generateCertificate() {
    let name = document.getElementById("studentName").value.trim();
    let course = document.getElementById("courseName").value;

    if (name === "") {
        alert("Please enter your name!");
        return;
    }

    let canvas = document.getElementById("certificateCanvas");
    let ctx = canvas.getContext("2d");

    canvas.width = 900;
    canvas.height = 600;

    let logo = new Image();
    let sign = new Image();

    logo.src = "IMG/VikTechLogo.png";
    sign.src = "IMG/VikasDasSign.png";

    logo.onload = function () {
        sign.onload = function () {
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = "#d4af37";
            ctx.lineWidth = 12;
            ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

            ctx.drawImage(logo, 50, 40, 120, 120);

            ctx.fillStyle = "#333";
            ctx.font = "40px Arial Bold";
            ctx.textAlign = "center";
            ctx.fillText("Certificate of Completion", canvas.width / 2, 150);

            ctx.font = "24px Arial";
            ctx.fillText("This is to certify that", canvas.width / 2, 220);

            ctx.font = "32px Arial Bold";
            ctx.fillStyle = "#6a0dad";
            ctx.fillText(name, canvas.width / 2, 270);

            ctx.fillStyle = "#333";
            ctx.font = "24px Arial";
            ctx.fillText("has successfully completed the", canvas.width / 2, 320);

            ctx.fillStyle = "#ff6600";
            ctx.font = "28px Arial Bold";
            ctx.fillText(course + " Course", canvas.width / 2, 370);

            ctx.font = "20px Arial";
            ctx.fillStyle = "#6a0dad";
            ctx.fillText("Provided by VikTech", canvas.width / 2, 450);

            ctx.drawImage(sign, canvas.width - 250, 480, 150, 50);
            
            ctx.fillStyle = "#333";
            ctx.font = "18px Arial";
            ctx.fillText("Vikas Das", canvas.width - 170, 540);
            ctx.fillText("CEO, VikTech", canvas.width - 170, 560);

            let link = document.createElement("a");
            link.download = "Certificate_" + name + ".png";
            link.href = canvas.toDataURL("image/png");
            link.click();

            closeCertificateForm();
        };
    };
}

