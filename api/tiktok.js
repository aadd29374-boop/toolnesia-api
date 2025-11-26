export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      status: "error",
      message: "Missing url parameter",
    });
  }

  try {
    const apiUrl =
      "https://www.tikwm.com/api/?url=" +
      encodeURIComponent(url) +
      "&hd=1";

    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "Mozilla/5.0 ToolNesia API" },
    });

    const data = await response.json();
    if (!data || data.code !== 0 || !data.data) {
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch data from TikTok",
      });
    }

    const d = data.data;

    return res.status(200).json({
      status: "success",
      platform: "tiktok",
      title: d.title,
      author: d.author,
      thumbnail: d.cover,
      download: {
        hd: d.hdplay || d.play,
        sd: d.play,
        audio: d.music,
      },
      duration: d.duration,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}
