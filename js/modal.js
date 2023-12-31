class modal extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });

    shadowRoot.innerHTML = `
          
      <style>
          
          .modal__section{
              display:flex;
          }
  
          .add_post_modal {
            max-width:1250px;
                display:grid;
              grid-template-columns: 4fr 3fr;
              place-content: center;
              z-index: 1; /* Sit on top */
              left: 0;
              top: 0;
            place-items:center;
            margin:auto;
              width:100%;
           
              height: 100%; /* Full height *
              -webkit-animation-name: fadeIn; /* Fade in the background */
              -webkit-animation-duration: 0.4s;
              animation-name: fadeIn;
              animation-duration: 0.4s;
            }
            
            .two_item_display {
              grid-row: 1/2 !important;
              grid-column: 1/2 !important;
              display: grid;
              width:100%;
            }
            
            .modal__background{
                margin:auto;
                display: none; /* Hidden by default */
                position: absolute; /* Stay in place */
                z-index: 1; /* Sit on top */
                left: 0;
                top: 0;
                width: 100%; /* Full width */
                height: 100%; /* Full height */
                overflow: auto; /* Enable scroll if needed */
                background-color: rgb(0, 0, 0); /* Fallback color */
                background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
                -webkit-animation-name: fadeIn; /* Fade in the background */
                -webkit-animation-duration: 0.4s;
                animation-name: fadeIn;
                animation-duration: 0.4s;
            }
  
            .form_container {
              display: flex;
              flex-direction: column;
              border-radius: 15px;
              background: #fff;
              box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.05);
              min-width:750px;
              height:100%;
              flex-shrink: 0;
              width:100%;
            }
  
            .create__new__post__title {
              width: 100%;
              display: flex;
              justify-content: center;
              align-content: center;
              height: 81px;
              font-family: "Sacramento", cursive;
              color: #000;
              font-size: 36px;
              font-style: normal;
              font-weight: 400;
              flex-wrap: wrap;
              border: 1px solid rgba(0, 0, 0, 0.25);
            }
  
            .post__details_container {
              height: 78%;
            }
  
            .post__details__form {
              height: 100%;
              padding: 41px 52px;
              display: flex;
              flex-direction: column;
            }
            .post__title {
              outline: none;
              color: #5a4282;
              font-family: "Open Sans", sans-serif;
              font-style: normal;
              font-weight: 300;
              font-size: 20px;
              width: 100%;
              /* box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.12); */
              border: none;
            }
            .post__title::placeholder {
              color: #5a4282;
              font-family: "Open Sans", sans-serif;
              font-size: 20px;
              font-style: normal;
              line-height: normal;
            }
            .post__description {
              word-break: break-word;
              outline: none;
              color: #5a4282 !important;
              margin-top: 30px;
              font-family: "Open Sans", sans-serif;
              font-style: normal;
              font-weight: 300;
              font-size: 20px;
              width: 100%;
              height: 100%;
              /* box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.12); */
              border: none;
              resize: none;
            }
            .post__description::placeholder {
              color: #5a4282;
              font-family: "Open Sans", sans-serif;
              font-size: 20px;
              font-style: normal;
              line-height: normal;
            }
            .submit__btn__wrapper {
              display: flex;
              justify-content: space-between;
            }
            .share__button {
              background: #fff;
              box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.12);
              border: none;
              padding: 8px 18px;
              color: #5a4282;
              font-family: "Open Sans", sans-serif;
              font-size: 18px;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
            }
            ::file-selector-button {
              display: none;
            }
            .input[type=file] {
              color:transparent;
            }
            .file__button{
              width:20%;
              background: #fff;
              box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.12);
              border: none;
              padding: 8px;
              color: #5a4282;
              font-family: "Open Sans", sans-serif;
              font-size: 18px;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
            }
            .image__preview__div {
              display: none;
              height:100%;
              background: #fff;
              box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.05);
              padding-left:32px;
              padding-right:32px;
              padding-top:36px;
              padding-bottom:76px;
              align-items: center;
              justify-self: flex-start;
              max-width: 747px;
              box-sizing:border-box;
              border-radius:15px;
              border-left: 1px solid rgba(0, 0, 0, 0.25);;
            }
            .image__preview {
              display:flex;
              object-fit: cover;
              width: 100%;
              height: 100%;
              border-radius:15px;
            }
              .modal_content{
                grid-row:1/2;
                grid-column:1/3;
                display:flex;
                margin:auto;
                justify-content:center;
                justify-self:flex-end;
                min-height:750px;
                height:100%;
              }
      </style>
  
          <section class='modal__section'>
          <div class='modal__background'>
          <div class='add_post_modal' id='add_post_modal'>
            <div class='modal_content'>
              <div class='form_container'>
                <div class='create__new__post__title'>
                  Create new post
                </div>
                <div class='post__details_container'>
                  <form class='post__details__form'  id='post__details__form'>
                    <input type='text' id='post__title' name='title' class='post__title'
                      placeholder='Post title' autocomplete='off' 
                      required />
  
                    <textarea type='text' id='post__description' 
                      class='post__description' name='description'
                      placeholder='Share your thoughts...'></textarea>
  
                    <div class='submit__btn__wrapper'>
  
                    
                      <input type='file' title ='Choose file'class='file__button' id='img-input' accept='image/*' />
                      <button type='submit' id='post_btn' class='share__button'>
                        Share
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
  
            <div class='image__preview__div'>
              <img id='img-from-local-storage' class='image__preview' />
            </div>
            </div>
          </section>
  
          `;

    const postForm = shadowRoot.querySelector("#post__details__form");
    postForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const input_title = shadowRoot.querySelector('#post__title')
      const input_description = shadowRoot.querySelector('#post__description')
      const input_file = shadowRoot.querySelector('.file__button')


      // Create a custom event with the form data
      const formSubmitEvent = new CustomEvent("formSubmit", {
        detail: {
          formData: new FormData(postForm),
        },
        bubbles: true, // Allow the event to bubble up
        composed: true,
        target: true,// Allow the event to cross shadow DOM boundaries
      });
      input_title.value = ""
      input_description.value = ""
      input_file.value = ""

      // const obj = formSubmitEvent;
      // Dispatch the custom event on the shadow DOM
      postForm.dispatchEvent(formSubmitEvent);
    });
  };
}

customElements.define("custom-modal", modal);
export default { modal };
