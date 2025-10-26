
function loadNavigation() {
    const nav = `
        <a href="http://maximmassenkoff.com/"> <h2>Maxim Massenkoff</h2> </a>
        <hr/>
        <p class="contactinfo"><a href="http://maximmassenkoff.com/#publications">Publications</a></p>
        <p class="contactinfo"><a href="http://maximmassenkoff.com/#workingpapers">Working Papers</a></p>
        <p class="contactinfo"><a href="http://maximmassenkoff.com/#workinprogress">Work in Progress</a></p>
        <p class="contactinfo"><a href="http://maximmassenkoff.com/#teaching">Teaching</a></p>
        <p class="contactinfo"><a href="http://maximmassenkoff.com/#tools">Tools</a></p>
        <p class="contactinfo"><a href="./data.html">Data</a></p>
        <p class="contactinfo"><a href="https://scholar.google.com/citations?user=aYALu3oAAAAJ&hl=en">Google Scholar</a></p>
        <p class="lastcontactinfo"><a href="https://apithymaxim.wordpress.com/">Blog</a></p>

        <img src="http://maximmassenkoff.com/images/maxim_pic.png" width="200px" alt="Photo" />
    `;
    document.getElementById('navigation').innerHTML = nav;
}

// Load when page is ready
document.addEventListener('DOMContentLoaded', loadNavigation);
