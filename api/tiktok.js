export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({
      status: "error",
      message: "URL parameter missing"
    });
  }

  try {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;

    const response = await fetch(apiUrl, {
      headers: {
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    const data = await response.json();

    if (!data || data.code !== 0 || !data.data) {
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch data from TikTok"
      });
    }

    const video = data.data;

    return res.status(200).json({
      status: "success",
      title: video.title,
      author: video.author,
      thumb: video.cover,
      video_no_watermark: video.play,
      video_watermark: video.wmplay,
      music_url: video.music
    });

  } catch (e) {
    return res.status(500).json({
      status: "error",
      message: e.message
    });
  }
}
