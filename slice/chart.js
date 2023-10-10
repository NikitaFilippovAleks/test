// Define variables
const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
// Set cap rounding style
ctx.lineCap = 'round';
// Load image into canvas
img.onload = function() {
  // Draw original image on canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  // Define starting angle and ending angle for the slice
  const startAngle = 0;
  const endAngle = Math.PI / 4;
  // Create clipping path for the slice
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, canvas.height / 2);
  ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle, endAngle);
  ctx.closePath();
  ctx.clip();
  // Draw the clipped image on the canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  // Draw a white border around the slice
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle, endAngle);
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#fff';
  ctx.stroke();
};
// Load image source
img.src = 'path/to/image.png';



