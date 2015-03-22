<h2>Service Runner</h2>
<code>app.js</code> is the file that is responsible for coordinating execution
of all the services. 

Note: We should changethe name of app.js later because the
naming may conflict with what Azure expects the name of our backend server to
be.

<h2>Services</h2>
<ol>
  <li><b>Scrape</b> Git repository meta data</li>
  <li><b>Download</b> Git repositories based on meta data</li>
  <li><b>Parse</b> Git repository content to detect security flaws</li>
</ol>

<h3>Scraping</h3>
<p>scraping.js is a service which is responsible for downloading the most
recently updated git repository meta data using Git API. It then persist those
repositories data to a MongoDB data store.</p>

<p>The current query for this API call is:
<code>?q=sort=updated&order=desc&page=1&per_page=53</code>

<code>page=1</code> is hardcoded currently. When we use a background process to automate running this file periodically we will have that background process be responsible for managing which page is being processed.

<code>per_page=53</code> is the maximum number of results per API call.</p>

<h3>Downloading</h3>
<p>Not complete</p>

<h3>Parsing</h3>
<p>Not complete</p>


<h3>Current Issues</h3>
<ol>
  <li>git_data needs to be cleaned out on every initialization on its own</li>
  <li>Extract mongo connection settings to central location</li>
  <li>Refactor naming</li>
  <li>Refactor callbacks to use eventEmitters instead</li>
  <li>Update README to include services information</li>
  <li>Add more API key detection criterion to parsing service</li>
</ol>
