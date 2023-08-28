<script>
    const apiUrl = 'https://yn63ricief.execute-api.eu-west-3.amazonaws.com/root/';

    function onClick() {
        navigator.clipboard.writeText(apiUrl);
        alert('Link copied!');
    }
</script>

<div>
    <h3>How to use:</h3>
    <div class="link_container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <p class="a" on:click={onClick}>API link</p>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img class="copy_button" src="/copy.png" alt="Copy" on:click={onClick} />
    </div>
    <p>
        <b>POST /crop-image</b>
    </p>
    <h2>General</h2>
    <p>Operations that will be used on image are determined by fields passed in input's config.</p>
    <p>
        The order of operations is always <b>crop</b> => <b>resize</b> => <b>convert</b> =>
        <b>compress</b>.
    </p>
    <ul>
        <li>
            <b>Crop</b>
            <p>
                Crop operation allows you to extract selected region of image by specifying starting
                point and region's size.
            </p>
            <p>Region must not go out of image's bounds.</p>
        </li>
        <li>
            <b>Resize</b>
            <p>
                Resize operation allows you to rescale your image and\or change it's aspect ratio.
            </p>
            <p>
                If only one of dimensions is specified, original aspect ratio is preserved;
                otherwise, image is cropped to fit the specified dimensions.
            </p>
        </li>
        <li>
            <b>Convert</b>
            <p>Convert allows you to select output image's format.</p>
            <p>Do not specify it to retain original format.</p>
        </li>
        <li>
            <b>Compress</b>
            <p>
                Compress operation attempts applying compression options to an image. Only supported
                by output format options will be applied (i.e. don't expect <b>jpeg</b> to be
                <b>lossless</b>).
            </p>
            <p>If convert isn't specified, compression is attempted using source image's format.</p>
        </li>
    </ul>
    <div class="code_container">
        <h3>Endpoint input</h3>
        <pre>
            <code class="min">
        <span class="green">type</span> <span class="orange">Input</span> = &#123;
            config: &#123;
                crop?: &#123;
                    top: <span class="green">number</span>; // non-negative integer
                    left: <span class="green">number</span>; // non-negative integer
                    height: <span class="green">number</span>; // positive integer
                    width: <span class="green">number</span>; // positive integer
                    &#125;;
                resize?: &#123;
                    height?: <span class="green">number</span>; // positive integer
                    width?: <span class="green">number</span>; // positive integer
                    &#125;;
                convert?: &#123;
                    format: "<span class="green">jpeg</span>" | "<span class="green">png</span
                >" | "<span class="green">webp</span>";
                    &#125;;
                compress?: &#123;
                    quality?: <span class="green">number</span>; // [1-100] range
                    lossless?: <span class="green">boolean</span>;
                    &#125;;
                &#125;
            </code>
        </pre>
    </div>
    <p>Input must be passed as <b> multipart/form-data</b></p>
    <p><b>config</b> object must be JSON-stringified.</p>
    <p><b>IMPORTANT:</b> Only one file per request is supported.</p>
    <div class="code_container">
        <h3>Endpoint output</h3>
        <pre>
            <code class="min">
        <span class="green">type</span> <span class="orange">Output</span> = <span class="green"
                    >string</span
                >;
            </code>
        </pre>
    </div>
    <br />
    <h2>Limits</h2>
    <p>
        <b>Request</b> and <b>Response</b> payloads are limited to <b>5Mb</b> by <b>API Gateway</b>.
    </p>
    <p>Exceeding the limits will\may result in <b>413</b>, <b>500</b>, <b>502</b> errors.</p>
</div>

<style>
    p {
        font-size: 1rem;
        font-weight: 400;
        line-height: 1;
        text-align: left;
        margin-bottom: 0.5em;
    }
    .a {
        text-decoration: none;
        color: black;
        font-size: 1.3rem;
        font-weight: 500;
        line-height: 1;
        text-align: left;
        cursor: pointer;
        margin: 0;
    }

    h3 {
        font-size: 1.5rem;
        font-weight: 500;
        line-height: 1;
        text-align: center;
        margin: 0;
    }
    h2 {
        font-size: 1.3rem;
        font-weight: 500;
        line-height: 1;
        text-align: center;
        margin: 0;
    }

    pre code {
        background-color: #eee;
        border: 1px solid #999;
        display: block;
        padding: 10px;
        margin: 0;
    }

    .code_container {
        /* width: 100%; */
        /* height: auto; */
        background-color: lightgrey;
        border-radius: 5px;
        border: 1px solid lightgrey;
        padding: 20px;
    }

    .green {
        color: green;
    }
    .orange {
        color: orange;
    }

    .link_container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: row;
        align-self: left;
        gap: 10px;
    }
    .copy_button {
        cursor: pointer;
    }

    @media (max-width: 600px) {
        .min {
            font-size: 0.6rem;
        }
    }
    @media (max-width: 420px) {
        .min {
            font-size: 0.4rem;
        }
    }
</style>
