document.getElementById('article-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('thumbnail', document.getElementById('thumbnail').files[0]);
    formData.append('image1', document.getElementById('image1').files[0]);
    formData.append('paragraph1', document.getElementById('paragraph1').value);
    
    // Optional fields
    const image2 = document.getElementById('image2').files[0];
    const paragraph2 = document.getElementById('paragraph2').value;
    
    const image3 = document.getElementById('image3').files[0];
    const paragraph3 = document.getElementById('paragraph3').value;

    const image4 = document.getElementById('image4').files[0];
    const paragraph4 = document.getElementById('paragraph4').value;

    const image5 = document.getElementById('image5').files[0];
    const paragraph5 = document.getElementById('paragraph5').value;
    
    if (image2) formData.append('image2', image2);
    if (paragraph2) formData.append('paragraph2', paragraph2);
    
    if (image3) formData.append('image3', image3);
    if (paragraph3) formData.append('paragraph3', paragraph3);

    if (image4) formData.append('image4', image4);
    if (paragraph4) formData.append('paragraph4', paragraph4);

    if (image5) formData.append('image5', image5);
    if (paragraph5) formData.append('paragraph5', paragraph5);
    
    try {
        const response = await fetch('http://122.53.28.51:8085/articles/', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('response').innerText = 'Article submitted successfully!';
        } else {
            document.getElementById('response').innerText = 'Failed to submit article: ' + result.detail;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('response').innerText = 'Error submitting article.';
    }
});