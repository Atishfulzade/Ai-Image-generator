const generateForm = document.querySelector(".formInput");
const imageGallary = document.querySelector(".image_gallary");
const OPENAI_API_KEY = "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";
const generateAiImages = async (userInput, imageQuantity) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userInput,
          n: parseInt(imageQuantity),
          size: "512x512",
          response_format: "b64_json",
        }),
      }
    );

    const updateImageGallary = (data) => {
      data.forEach((image, index) => {
        const imageCard = imageGallary.querySelectorAll(".image_group")[index];
        const imgSource = imageCard.querySelector("img");
        const AiGeneratedImage = `data:image/jpeg;base64,${image.b64_json}`;

        imgSource.src = AiGeneratedImage;
        imgSource.onload = () => {
          imgSource.classList.remove("loader");
        };
      });
    };

    if (!response.ok)
      throw new Error("Failed to generate images! Please try again.");
    const { data } = await response.json();
    updateImageGallary(data);
  } catch (error) {
    throw new Error(error);
  }
};

const submitForm = (e) => {
  e.preventDefault();
  const userInput = e.srcElement[0].value;
  const imageQuantity = e.srcElement[1].value;

  const imageCard = Array.from(
    { length: imageQuantity },
    () =>
      ` <div class="image_group">
<img class="loader main_image" src="../images/tube-spinner.svg" alt="" />
</div>
</div>`
  ).join("");

  imageGallary.innerHTML = imageCard;

  generateAiImages(userInput, imageQuantity);
};
generateForm.addEventListener("submit", submitForm);
