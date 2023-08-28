<script>
    import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';

    const endpoint = 'https://csji0zqor0.execute-api.us-east-1.amazonaws.com/prod/resize';

    let files = {
        accepted: [],
        rejected: [],
        converted: [],
    };

    function handleFileSelect(e) {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
        files.converted = [];
        console.log(files);
    }

    function handleRemoveFile(e, index) {
        files.accepted.splice(index, 1);
        files.accepted = [...files.accepted];
    }

    async function handleUpload() {
        if (files.accepted.length > 0) {
            files.accepted.forEach(async (file) => {
                const formData = new FormData();
                formData.append('Content-Type', 'multipart/form-data');
                formData.append('content-type', 'multipart/form-data');
                formData.append('file', file, `${file.name}`);

                const upload = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                });
                files.accepted = [];

                const data = await upload.json();

                if (data) {
                    files.converted = [...files.converted, { name: file.name, data: data }];
                }
            });
        }
    }

    function goBack() {
        files.converted = [];
    }
</script>

<div>
    {#if !files.converted.length}
        <p>Drag and drop your image to area or select with <b>Add files</b> button</p>
        <Dropzone
            on:drop={handleFileSelect}
            accept={['image/*']}
            multiple={true}
            containerClasses="custom-dropzone"
        >
            <button class="add_button">Add files</button>

            <p>or</p>
            <p>Drag and drop file here</p>
        </Dropzone>
        <div style="margin: 5px;">
            {#each files.accepted as item, index}
                <div class="item_container">
                    <div class="name_wrap">
                        <p class="image_name">{index + 1}.</p>
                    </div>
                    <div class="name_wrap">
                        <p class="image_name">{item.name}</p>
                    </div>
                    <div class="wrapper">
                        <div class="name_wrap">
                            <p class="image_name">{(item.size / 1000).toFixed(0)} KB</p>
                        </div>
                        <button class="remove_button" on:click={(e) => handleRemoveFile(e, index)}>
                            <img src="/delete.png" alt="Delete" width="20" height="20" />
                        </button>
                    </div>
                </div>
            {/each}
        </div>
        {#if files.accepted.length > 0}
            <div class="button_container">
                <button class="upload_button" on:click={handleUpload}>Convert</button>
            </div>
        {/if}
    {:else}
        {#each files.converted as file}
            <div class="links_container">
                <p class="image_name">{file.name}</p>
                <div class="image_links">
                    <a
                        class="image_link"
                        href={file.data.convertedImage}
                        rel="noreferrer noopener"
                        target="_blank">Download Converted Image</a
                    >
                </div>
            </div>
        {/each}
        <div class="back_button-wrap">
            <button class="back_button" on:click={goBack}>Convert more</button>
        </div>
    {/if}
</div>

<style>
    p {
        font-size: 1rem;
        font-weight: 400;
        line-height: 1;
        text-align: left;
        margin-bottom: 0.5em;
    }
    .add_button {
        color: white;
        background-color: navy;
        border: 2px solid navy;
        height: 30px;
        border-radius: 5px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
            scale: 0.95;
        }
    }

    .item_container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid navy;
        margin-bottom: 15px;
    }
    .remove_button {
        width: 30px;
        height: 30px;
        border: none;
        outline: none;
        background-color: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
    }
    .button_container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: auto;
    }
    .upload_button {
        color: white;
        background-color: navy;
        border: 1px solid navy;
        height: 30px;
        width: 150px;
        border-radius: 5px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        vertical-align: center;
        cursor: pointer;

        &:hover {
            scale: 0.95;
        }
    }
    .links_container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        margin-top: 20px;
        border-bottom: 1px solid navy;
        padding: 0 10px;
    }

    .image_links {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .image_link {
        text-decoration: none;
        color: navy;
        width: 200px;
        height: 50px;
        background-color: transparent;
        border: none;
        font-weight: 500;
        font-size: 15px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        object-fit: contain;
    }

    .image_name {
        font-size: 1rem;
        font-weight: 400;
        color: navy;
        line-height: 1;
        text-align: left;
        margin: 0;
    }
    .back_button-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        margin-top: 30px;
    }
    .back_button {
        text-decoration: none;
        color: white;
        background-color: navy;
        width: 300px;
        height: 50px;
        border: 1px solid black;
        font-weight: 600;
        font-size: 20px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        object-fit: contain;
        align-self: right;

        &:hover {
            scale: 0.95;
        }
    }

    .name_wrap {
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .wrapper {
        width: 30%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
    }
</style>
