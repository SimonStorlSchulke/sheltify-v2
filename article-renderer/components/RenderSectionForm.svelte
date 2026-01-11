<svelte:options
  customElement={{
    tag: "section-form",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { SectionForm } from "sheltify-lib/article-types";
  let { section, submitUrl }: { section: SectionForm; submitUrl: string } = $props();

  interface FormSubmissionData {
    Type: string;
    SenderMail: string;
    Text: string;
  }

  let submitted = $state(false);
  let isFormValid = $state(false);

  function validateForm() {
    const formElement = document.querySelector("form") as HTMLFormElement;
    isFormValid = formElement?.checkValidity() ?? true;
  }

  async function handleSubmit() {
    const formElement = document.querySelector("form") as HTMLFormElement;
    const formData = new FormData(formElement);

    // Build HTML summary of all form inputs
    let htmlSummary = "<div>";

    for (const input of section.Content.Inputs) {
      const value = formData.get(input.Label);
      htmlSummary += `<p><strong>${input.Label}:<br></strong> ${value || ' - '}</p><br>`;
    }

    htmlSummary += "</div>";

    // Get email from form
    const senderMail = (formData.get("email") || formData.get("Email") || "") as string;

    // Create the submission object
    const submissionData: FormSubmissionData = {
      Type: section.Content.Name,
      SenderMail: senderMail,
      Text: htmlSummary,
    };

    console.log("Form Submission Data:", submissionData);
    
    fetch(submitUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        console.log("Form submitted successfully:", data);
        submitted = true;
        formElement.reset();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        alert("Fehler beim Abschicken des Formulars - bitte schreiben Sie uns eine E-Mail.");
      });
  }
</script>

<form>
  <div class="sui flex-y gap-2">

  <div class="form-group">
    <label for="email">E-Mail <span class="required">*</span></label><br>
    <input type="email" id="email" name="email" required on:change={validateForm} />
  </div>

    {#each section.Content.Inputs as input}
    <div class="form-group">
      <label for={input.Label}>{input.Label}{#if input.Required} <span class="required">*</span>{/if}</label>
      <br>
      
      {#if input.Type === 'textarea'}
      <textarea id={input.Label} name={input.Label} required={input.Required} on:change={validateForm}></textarea>
      {:else if input.Type === 'checkbox'}
      <input type="checkbox" id={input.Label} name={input.Label} required={input.Required} on:change={validateForm} />
      {:else if input.Type === 'radio'}
      {#each input.RadioOptions as option}
        <div class="radio-option sui ml-2">
          <input type="radio" id={`${input.Label}-${option}`} name={input.Label} value={option} required={input.Required} on:change={validateForm} />
          <label for={`${input.Label}-${option}`}>{option}</label>
        </div>
      {/each}
      {:else}
      <input type={input.Type} id={input.Label} name={input.Label} required={input.Required} on:change={validateForm} />
      {/if}
      
    </div>
    {/each}
  </div>
  <br>

    {#if section.Content.SubmitInfo}
      <p>{section.Content.SubmitInfo}</p>
    {/if}

    {#if !submitted}
      
      <button type="button" on:click={handleSubmit} disabled={!isFormValid}>{section.Content.SubmitButtonText || "Abschicken"}</button>
      {#if !isFormValid}
        <span class="required-info">Alle mit <span class="required">*</span> markierten Felder müssen ausgefüllt werden</span>
      {/if}
    {:else}
      <p>{section.Content.AfterSubmitText || 'Vielen Dank für Ihre Einsendung'}</p>
    {/if}

</form>
