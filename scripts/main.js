document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resume-form');
    const preview = document.getElementById('preview');
    const templateSelect = document.getElementById('template-select');
    const addEducationBtn = document.getElementById('add-education');
    const addExperienceBtn = document.getElementById('add-experience');
    const downloadPdfBtn = document.getElementById('download-pdf');
    const downloadWordBtn = document.getElementById('download-word');
    const printPreviewBtn = document.getElementById('print-preview');
    printPreviewBtn.addEventListener('click', function() {
        window.print();
    });
    document.querySelector('header h1').innerHTML = document.querySelector('header h1').textContent.split('').map((char, i) => `<span style="display:inline-block;animation-delay:${i * 0.1}s">${char}</span>`).join('');
    const h1 = document.querySelector('header h1');
    const text = h1.textContent;
    h1.textContent = '';
    
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.animationDelay = `${i * 0.1}s`;
        h1.appendChild(span);
    }
    const photoInput = document.getElementById('photo');

    let photoDataUrl = '';

    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoDataUrl = e.target.result;
                updatePreview();
            };
            reader.readAsDataURL(file);
        }
    });

    function updatePreview() {
        const template = templateSelect.value;
        preview.className = `resume ${template}`;

        fetch(`templates/${template}.html`)
            .then(response => response.text())
            .then(html => {
                preview.innerHTML = html;
                fillPreview();
            });
    }

    function fillPreview() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const summary = document.getElementById('summary').value;
        const skills = document.getElementById('skills').value;

        preview.querySelector('#preview-name').textContent = name;
        preview.querySelector('#preview-email').textContent = email;
        preview.querySelector('#preview-phone').textContent = phone;
        preview.querySelector('#preview-summary').textContent = summary;
        const photoPreview = preview.querySelector('#preview-photo');
        if (photoPreview) {
            if (photoDataUrl) {
                photoPreview.src = photoDataUrl;
                photoPreview.style.display = 'block';
            } else {
                photoPreview.style.display = 'none';
            }
        }
        const skillsList = preview.querySelector('#preview-skills');
        skillsList.innerHTML = '';
        skills.split(',').forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill.trim();
            skillsList.appendChild(li);
        });

        const educationContainer = preview.querySelector('#preview-education');
        educationContainer.innerHTML = '';
        document.querySelectorAll('.education-entry').forEach(entry => {
            const degreeInput = entry.querySelector('input[placeholder="Degree"]');
            const institutionInput = entry.querySelector('input[placeholder="Institution"]');
            const yearInput = entry.querySelector('input[placeholder="Year"]');

            if (degreeInput && institutionInput && yearInput) {
                const degree = degreeInput.value;
                const institution = institutionInput.value;
                const year = yearInput.value;

                const educationEntry = document.createElement('div');
                educationEntry.innerHTML = `
                    <h4>${degree}</h4>
                    <p>${institution}, ${year}</p>
                `;
                educationContainer.appendChild(educationEntry);
            }
        });

        const experienceContainer = preview.querySelector('#preview-experience');
        experienceContainer.innerHTML = '';
        document.querySelectorAll('.experience-entry').forEach(entry => {
            const jobTitleInput = entry.querySelector('input[placeholder="Job Title"]');
            const companyInput = entry.querySelector('input[placeholder="Company"]');
            const yearsInput = entry.querySelector('input[placeholder="From(year)-To(year)"]');
            const descriptionInput = entry.querySelector('textarea[placeholder="Description"]');
            if (jobTitleInput && companyInput && yearsInput && descriptionInput) {
                const jobTitle = jobTitleInput.value;
                const company = companyInput.value;
                const years = yearsInput.value;
                const description = descriptionInput.value;

                const experienceEntry = document.createElement('div');
                experienceEntry.innerHTML = `
                    <h4>${jobTitle}</h4>
                    <p>${company}, ${years}</p>
                    <p>${description}</p>
                `;
                experienceContainer.appendChild(experienceEntry);
            }
        });
    }

    form.addEventListener('input', updatePreview);
    templateSelect.addEventListener('change', updatePreview);
    addEducationBtn.addEventListener('click', addEducation);
    addExperienceBtn.addEventListener('click', addExperience);
    downloadPdfBtn.addEventListener('click', generatePDF);
    downloadWordBtn.addEventListener('click', generateWord);

    function addEducation() {
        const container = document.getElementById('education-container');
        const newEntry = document.createElement('div');
        newEntry.className = 'education-entry mb-3';
        newEntry.innerHTML = `
            <input type="text" class="form-control mb-2" placeholder="Degree" required>
            <input type="text" class="form-control mb-2" placeholder="Institution" required>
            <input type="text" class="form-control mb-2" placeholder="Year" required>
        `;
        container.appendChild(newEntry);
        updatePreview();
    }

    function addExperience() {
        const container = document.getElementById('experience-container');
        const newEntry = document.createElement('div');
        newEntry.className = 'experience-entry mb-3';
        newEntry.innerHTML = `
            <input type="text" class="form-control mb-2" placeholder="Job Title" required>
            <input type="text" class="form-control mb-2" placeholder="Company" required>
            <input type="text" class="form-control mb-2" placeholder="Years" required>
            <textarea class="form-control mb-2" placeholder="Description" rows="3"></textarea>
        `;
        container.appendChild(newEntry);
        updatePreview();
    }

    function generateWord() {
        const header = document.getElementById('name').value + '\n' +
                       document.getElementById('email').value + '\n' +
                       document.getElementById('phone').value + '\n\n';

        const summary = 'Summary\n' + document.getElementById('summary').value + '\n\n';
        const education = 'Education\n' + Array.from(document.querySelectorAll('.education-entry')).map(entry => {
            const degreeInput = entry.querySelector('input[placeholder="Degree"]');
            const institutionInput = entry.querySelector('input[placeholder="Institution"]');
            const yearInput = entry.querySelector('input[placeholder="Year"]');

            if (degreeInput && institutionInput && yearInput) {
                return (
                    degreeInput.value + '\n' +
                    institutionInput.value + ', ' +
                    yearInput.value + '\n\n'
                );
            }
            return '';
        }).join('');

        const workExperience = 'Work Experience\n' + Array.from(document.querySelectorAll('.experience-entry')).map(entry => {
            const jobTitleInput = entry.querySelector('input[placeholder="Job Title"]');
            const companyInput = entry.querySelector('input[placeholder="Company"]');
            const yearsInput = entry.querySelector('input[placeholder="Years"]');
            const descriptionInput = entry.querySelector('textarea[placeholder="Description"]');

            if (jobTitleInput && companyInput && yearsInput && descriptionInput) {
                return (
                    jobTitleInput.value + '\n' +
                    companyInput.value + ', ' +
                    yearsInput.value + '\n' +
                    descriptionInput.value + '\n\n'
                );
            }
            return '';
        }).join('');

        const skills = 'Skills\n' + document.getElementById('skills').value + '\n';

        const docContent = header + summary + education + workExperience + skills;

        const blob = new Blob([docContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.doc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function generatePDF() {
        const docDefinition = {
            content: [
                { text: document.getElementById('name').value, style: 'header' },
                { text: document.getElementById('email').value },
                { text: document.getElementById('phone').value },
                { text: '\n' },
                { text: 'Summary', style: 'subheader' },
                document.getElementById('summary').value,
                { text: '\n' },
                { text: 'Education', style: 'subheader' },
                ...Array.from(document.querySelectorAll('.education-entry')).map(entry => {
                    const degreeInput = entry.querySelector('input[placeholder="Degree"]');
                    const institutionInput = entry.querySelector('input[placeholder="Institution"]');
                    const yearInput = entry.querySelector('input[placeholder="Year"]');

                    if (degreeInput && institutionInput && yearInput) {
                        return {
                            text: [
                                { text: degreeInput.value + '\n', bold: true },
                                institutionInput.value + ', ' + yearInput.value + '\n\n'
                            ]
                        };
                    }
                    return null;
                }).filter(Boolean),
                { text: 'Work Experience', style: 'subheader' },
                ...Array.from(document.querySelectorAll('.experience-entry')).map(entry => {
                    const jobTitleInput = entry.querySelector('input[placeholder="Job Title"]');
                    const companyInput = entry.querySelector('input[placeholder="Company"]');
                    const yearsInput = entry.querySelector('input[placeholder="Years"]');
                    const descriptionInput = entry.querySelector('textarea[placeholder="Description"]');

                    if (jobTitleInput && companyInput && yearsInput && descriptionInput) {
                        return {
                            text: [
                                { text: jobTitleInput.value + '\n', bold: true },
                                companyInput.value + ', ' + yearsInput.value + '\n',
                                descriptionInput.value + '\n\n'
                            ]
                        };
                    }
                    return null;
                }).filter(Boolean),
                { text: 'Skills', style: 'subheader' },
                document.getElementById('skills').value
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 10, 0, 5]
                }
            }
        };

        pdfMake.createPdf(docDefinition).download('resume.pdf');
    }

    function printPreview() {
        const printWindow = window.open('', '_blank');
        const template = templateSelect.value;
        printWindow.document.write('<html><head><title>Print Resume</title>');
        printWindow.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">');
        printWindow.document.write('<link rel="stylesheet" href="styles/main.css">');
        printWindow.document.write(`<link rel="stylesheet" href="styles/templates/${template}.css">`);
        printWindow.document.write('</head><body>');
        printWindow.document.write(preview.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }

    updatePreview();
});