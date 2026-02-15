# Transformation URL API reference


The Transformation URL API enables you to deliver media assets, including a large variety of on-the-fly transformations through the use of URL parameters. This reference provides comprehensive coverage of all available URL transformation parameters, including syntax, value details, and examples.

> **See also:**:
>
> * [Image transformation guide](./image_transformations)

> * [Video transformation guide](./video_manipulation_and_delivery)

> * [Transformation basics video tutorial](./transformation_basics_tutorial)

## Overview
The default Cloudinary asset delivery URL has the following structure:

  
    
      https://res.cloudinary.com/&lt;cloud_name&gt;/&lt;asset_type&gt;/&lt;delivery_type&gt;/&lt;transformations&gt;/&lt;version&gt;/&lt;public_id_full_path&gt;.&lt;extension&gt;
    
  

This reference covers the parameters and corresponding options and values that can be used in the `<transformations>` element of the URL. It also covers the [\<extension\>](#_lt_extension_gt) element.

For information on other elements of the URL, see [Transformation URL syntax](./image_transformations#transformation_url_syntax).

> **INFO**: The transformation names and syntax shown in this reference refer to the **URL API**. 

Depending on the Cloudinary SDK you use, the names and syntax for the same transformation may be different. Therefore, all of the transformation examples in this reference also include the code for generating the example delivery URL from your chosen SDK. 

The SDKs additionally provide a variety of helper methods to simplify the building of the transformation URL as well as other built-in capabilities. You can find more information about these in the relevant [SDK guides](./cloudinary_sdks).
 > **TIP**:
>
> You can use the [Media Library](./media_library_for_developers) to preview and manage your transformations:

> * [Quickly test transformations](./media_library_for_developers#quick_delivery_testing) in the Media Library by opening the image URL and manually adding transformations before implementing them programmatically.  

> * [Manage derived assets](./media_library_for_developers#derived_assets) from the **Derived Assets** tab in an asset's Manage page.
#### Parameter types
There are two types of transformation parameters:

* **Action parameters**: Parameters that perform a specific transformation on the asset.
* **Qualifier parameters**: Parameters that do not perform an action on their own, but rather alter the default behavior or otherwise adjust the outcome of the corresponding action parameter.
See the _Transformation Guide_ for additional guidelines and best practices regarding [parameter types](./image_transformations#parameter_types).

## .\<extension\>
&nbsp;

Although not a transformation parameter belonging to the `<transformation>` element of the URL, the extension of the URL can transform the format of the delivered asset, in the same way as [f_\<supported format\>](#f_supported_format).

If [f_\<supported format\>](#f_supported_format) or [f_\<auto\>](#f_auto) are not specified in the URL, the format is determined by the extension. If no format or extension is specified, then the asset is delivered in its originally uploaded format.

* If using an SDK to generate your URL, you can control the extension using the `format` parameter, or by adding the extension to the public ID.
* If using a raw transformation, for example to define an [eager](./eager_and_incoming_transformations#eager_transformations) or [named](./image_transformations#named_transformations) transformation, you can specify the extension at the end of the transformation parameters, following a forward slash. For example, `c_pad,h_300,w_300/jpg` means that the delivery URL has transformation parameters of `c_pad,h_300,w_300` and a `.jpg` extension. `c_pad,h_300,w_300/` represents the same transformation parameters, but with no extension.

{note}
As the extension is considered to be part of the transformation, be careful when defining [eager transformations](./eager_and_incoming_transformations#eager_transformations) and transformations that are allowed when [strict transformations](./control_access_to_media#strict_transformations) are enabled, as the delivery URL must exactly match the transformation, including the extension. 
{/note}

#### Syntax details
| Value     | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| extension | string | The format to use when delivering the asset. **Possible values**: Any supported delivery format as relevant for the file type you are delivering: [Supported image formats](./image_transformations#supported_image_formats)[Supported video formats](./video_manipulation_and_delivery#supported_video_formats)[Supported audio formats](./audio_transformations#supported_audio_formats)**Default**: The originally uploaded format of the asset. |

#### Examples
1. Deliver the image as a JPEG by setting the extension (`.jpg`):
    ![Sheep image delivered as a JPG](https://res.cloudinary.com/demo/image/upload/sheep.jpg "thumb: h_150")
1. Deliver the image as a PNG by using the SDK `format` parameter, which sets the extension of the URL. Note that in contrast to [f (fetch format)](#f_format), this isn't a _transformation_ parameter, but rather an SDK parameter that controls the file extension of the public ID in the resulting URL.
   
    ```multi
    |url
    https://res.cloudinary.com/demo/image/upload/sheep.png 

    |ruby 
    cl_image_tag("sheep", format: "png")

    |php_2
    // Not applicable to this SDK.

    |python
    CloudinaryImage("sheep").image(format="png")

    |nodejs
    cloudinary.image("sheep", {format: "png"})

    |java
    cloudinary.url().format("png").imageTag("sheep");

    |js_2
    // Not applicable to this SDK.

    |js
    cloudinary.imageTag('sheep', {format: "png"}).toHtml();

    |jquery
    $.cloudinary.image("sheep", {format: "png"})

    |react
    <Image publicId="sheep" format="png">
    </Image>

    |vue
    <cld-image publicId="sheep" format="png">
    </cld-image>

    |angular
    <cl-image public-id="sheep" format="png">
    </cl-image>

    |csharp
    cloudinary.Api.UrlImgUp.Format("png").BuildImageTag("sheep")

    |go
    my_img, err := cld.Image("sheep")
    my_img.Transformation = "f_png"
	url, err := my_img.String()

    |android
    MediaManager.get().url().format("png").generate("sheep");

    |swift
    imageView.cldSetImage(cloudinary.createUrl().setFormat("png").generate("sheep")!, cloudinary: cloudinary)

    |kotlin
    // Not applicable to this SDK.

    ```

    ![Sheep image delivered as a PNG](https://res.cloudinary.com/demo/image/upload/sheep.png "thumb: h_150, with_code:false, with_url:false")
2. Deliver the image in its originally uploaded format (no extension specified):
    ![Sheep image delivered in original format](https://res.cloudinary.com/demo/image/upload/sheep "thumb: h_150")

## a (angle)
&nbsp;

Rotates or flips an asset by the specified number of degrees or automatically according to its orientation or available metadata. Multiple modes can be applied by [concatenating their values with a dot](#dot_rotation).

[//]: # ([\<degrees\>](#a_degrees) | [\<mode\>](#a_mode) )

**Learn more**: [Rotating images](./effects_and_artistic_enhancements#rotating_images) | [Rotating videos](./video_manipulation_and_delivery#rotating_videos)

### \<degrees\>
&nbsp;`a_<degrees>`

Rotates an asset by the specified angle.

**See also**: [Arithmetic expressions](./user_defined_variables#arithmetic_expressions)

#### Syntax details
| Value   | Type    | Description                                                                                                                                                                                                         |
| ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| degrees | integer | The number of degrees to rotate the asset clockwise (positive value) or counter-clockwise (negative value). If the angle is not a multiple of 90, a rectangular bounding box is added containing the rotated asset. |

{note}
If either the width or height of an asset exceeds 3000 pixels, the asset is automatically downscaled first, and then rotated. This applies to the size of the asset that is the input to the rotation, whether that be the output of a previous chained transformation or the original asset size. 
{/note}

#### Examples
1. Rotate an image by 90 degrees clockwise (`a_90`):

    ![Rotate image by 90 degrees clockwise](https://res.cloudinary.com/demo/image/upload/a_90/sheep.jpg "thumb: h_150")

1. Rotate a video by 20 degrees counterclockwise (`a_-20`):

    ![Rotate image by 20 degrees counterclockwise](https://res.cloudinary.com/demo/video/upload/a_-20/docs/hotel-slow-motion-waterfall.mp4 "thumb: h_150")

### \<mode\>
&nbsp;`a_<mode>`

Rotates an image or video based on the specified mode.

**Use with:** To apply one of the `a_auto` modes, use it as a qualifier with a [cropping](#c_crop_resize) action that adjusts the aspect ratio, as per the syntax details and example below.

#### Syntax details
| Value | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mode  | constant | **Required.** The rotation mode to apply. **Possible values**: `vflip`: Vertically mirror flips the image or video.`hflip`: Horizontally mirror flips the image or video.`ignore`:  **Applicable to images only**. By default, the image is automatically rotated according to the EXIF data stored by the camera when the image was taken. Set the rotation to `ignore` if you do not want the image to be automatically rotated.  `auto_right`: **Applicable to images only**. If the requested aspect ratio of a crop does not match the image's original aspect ratio (landscape vs portrait ratio), rotates the image 90 degrees clockwise. Must be used as a [qualifier](#parameter_types) of a [cropping](#c_crop_resize) action. `auto_left`: **Applicable to images only**. If the requested aspect ratio of a crop does not match the image's original aspect ratio (it is greater than 1, while the original is less than 1, or vice versa), rotates the image 90 degrees counterclockwise. Must be used as a [qualifier](#parameter_types) of a [cropping](#c_crop_resize) action. |

{tip}
To apply multiple values, separate each value with a dot (`.`). For example to horizontally flip the image and rotate it by 45 degrees: `a_hflip.45`
{/tip}

#### Examples
1. Vertically mirror flip the image and then rotate it by another 20 degrees clockwise using the dot notation to apply more than one rotation option (`a_vflip`):
    ![Vertical mirror flip of the image.](https://res.cloudinary.com/demo/image/upload/a_vflip.20/sheep.png "thumb: h_150")

1. In the following example, the image is rotated counter-clockwise (`a_auto_left`) because the original image was a landscape (aspect ratio greater than 1), while the requested aspect ratio is portrait (aspect ratio = 0.7).  If the requested aspect ratio had been 1.0 or larger, the same transformation would not result in rotation.

    ![Rotate image by 90 degrees clockwise if aspect ratio does not match original](https://res.cloudinary.com/demo/image/upload/c_fill,w_300,ar_0.7,a_auto_left/sheep.jpg "thumb: h_150")

## ac (audio codec)
&nbsp;`ac_<codec value>`

Sets the audio codec.

#### Syntax details
| Value       | Type     | Description                                                                                                                                                                                                                                                                                                                                                            |
| ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| codec value | constant | **Required.** The audio codec to use. **Possible values**:`none`: Removes the audio channel.`aac`: Sets the audio codec to aac (mp4 only).`vorbis`: Sets the audio codec to vorbis (ogv or webm only).`mp3`: Sets the audio codec to mp3 (mp4 only).`opus`: Sets the audio codec to opus (webm only).`pcm24`: Sets the audio codec to PCM signed 24-bit little-endian. |

#### Examples
Remove the audio from a video (`ac_none`):

![Remove the audio track](https://res.cloudinary.com/demo/video/upload/ac_none/docs/parrot.mp4 "thumb: h_250, muted:false")

## af (audio frequency)
&nbsp;`af_<frequency value>`

Controls the audio sampling frequency.

As a [qualifier](#parameter_types), can be used to preserve the original frequency, overriding the default frequency behavior of `vc_auto`.

**As a qualifier, use with**: [vc_auto](#vc_auto)

**Learn more**: [Audio frequency control](./audio_transformations#audio_frequency_control)

#### Syntax details
| Value           | Type                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| frequency value | string &#124; constant | A frequency value in Hz. **Possible values**: A fixed value specific to the codec used:aac: `96000`, `88200`, `64000`, `48000`, `44100`, `32000`, `24000`, `22050`, `16000`, `12000`, `11025`, `8000`, `7350`libfdk_aac: `96000`, `88200`, `64000`, `48000`, `44100`, `32000`, `24000`, `22050`, `16000`, `12000`, `11025`, `8000`, `0`mp3: `44100`, `48000`, `32000`, `22050`, `24000`, `16000`, `11025`, `12000`, `8000`, `0`opus: `48000`, `24000`, `16000`, `12000`, `8000`, `0`	pcm: `48000`, `96000`, `0``iaf`: Retains the original (initial) audio frequency of the video. This value is relevant when using [vc_auto](#vc_video_codec), where the audio frequency would otherwise automatically default to another value. |

#### Example
Set the audio frequency to 96000 Hz (`af_96000`):

![Set the audio frequency to 96000 Hz](https://res.cloudinary.com/demo/video/upload/af_96000/docs/parrot.mp4 "thumb: h_250, muted:false")

## ar (aspect ratio)
&nbsp;`ar_<ratio value>`

A [qualifier](#parameter_types) that crops or resizes the asset to a new aspect ratio, for use with a crop/resize mode that determines how the asset is adjusted to the new dimensions.

**Use with**: [c (crop/resize)](#c_crop_resize)

**Learn more**: [Setting the resize dimensions](./resizing_and_cropping#setting_the_resize_dimensions)

**See also**: [h (height)](#h_height) | [w (width)](#w_width) | [Arithmetic expressions](./user_defined_variables#arithmetic_expressions)

#### Syntax details
| Value       | Type                | Description                                                                                                                                                                                                                                      |
| ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ratio value | string &#124; float | **Required**. The aspect ratio to apply. Can be set as either:A **string** value in the form `a:b`, where `a` is the width and `b` is the height (e.g., `16:9`). A **decimal** value representing the width divided by the height (e.g., `0.5`). |

#### Examples
1. Crop an image to an aspect ratio of 1.5 (`ar_1.5,c_crop`):

    ![Aspect ratio 1.5](https://res.cloudinary.com/demo/image/upload/ar_1.5,c_crop/docs/camera-640.jpg "thumb: h_150")

1. Fill a video to an aspect ratio of 1:1 (`ar_1:1,c_fill`):

    ![Aspect ratio 1:1](https://res.cloudinary.com/demo/video/upload/ar_1:1,c_fill/ship.mp4 "thumb: h_150")

## b (background)
&nbsp;

Applies a background to empty or transparent areas.

[//]: # ([\<color value\>](#b_color_value) |  [auto](#b_auto) | [blurred](#b_blurred))

### \<color value\>
&nbsp;`b_<color value>`

Applies the specified background color on transparent background areas in an image. 

Can also be used as a [qualifier](#parameter_types) to override the default background color for padded cropping of images and videos, text overlays and generated waveform images.

When using [chained transformations](./image_transformations#chained_transformations), we recommend that you use this parameter as a qualifier to a pad crop that doesn't change the result (like `c_pad,w_1.0`), rather than by itself in a component. Using background by itself can lead to unpredictable results. For example:

![Convert the transparent areas of an image to the specified color](https://res.cloudinary.com/demo/image/upload/e_background_removal/b_lightblue,c_pad,w_1.0/e_trim/e_gen_restore/docs/cupcake.png "thumb: h_150")

Rather than (background not applied):

![Convert the transparent areas of an image to the specified color](https://res.cloudinary.com/demo/image/upload/e_background_removal/b_lightblue/e_trim/e_gen_restore/docs/cupcake.png "thumb: h_150")

**As a qualifier, use with**: [c_auto_pad - image only](#c_auto_pad) | [c_fill_pad - image only](#c_fill_pad) | [c_lpad](#c_lpad) | [c_mpad - image only](#c_mpad) | [c_pad](#c_pad) | [l_subtitles](#l_subtitles) | [l\_text](#l_text) | [fl_waveform](#fl_waveform)

**Learn more**: [Background color for images](./effects_and_artistic_enhancements#setting_background_color) | [Background color for videos](./video_effects_and_enhancements#background_color)

#### Syntax details
| Value       | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| color value | string | **Required.** The background color to apply. It can be set as:A 3- or 4-digit RGB/RGBA hex An RGB or RGBA hex triplet or quadruplet (6 or 8 digits) A named color`transparent` or `none` for no background.When specifying any RGB or RGBA value, always prefix the value in the URL with `rgb:` (without `#`). For example, `b_rgb:FEB61FC2` or `b_rgb:999`. When using a named color, specify only the color name. For example `b_blue`. |

#### Examples
1. Convert the transparent background of the `car_white` image to a light-blue color (`b_lightblue`):
   ![Convert the transparent areas of an image to the specified color](https://res.cloudinary.com/demo/image/upload/b_lightblue/car_white.png "thumb: h_150")
2. Scale to fit an image into a 150 x 150 square and pad any excess space with a brown background (`b_brown`):
    ![green background](https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_pad,b_brown/docs/camera-640.jpg)

3. Apply 'chocolate' color padding to deliver the video in a 1:1 aspect ratio (`b_chocolate,c_pad,h_150,w_150`)
    ![video padded to a width and height of 150 pixels with green background](https://res.cloudinary.com/demo/video/upload/b_chocolate,c_pad,h_150,w_150/coffee_pour.mp4)

4. Add a semi-transparent yellow background color to a text overlay (`b_rgb:FEB61FC2,co_yellow,l_text:Arial_100:Flowers/fl_layer_apply`)
    ![Add a background color to a text overlay](https://res.cloudinary.com/demo/image/upload/c_scale,w_400/b_rgb:FEB61FC2,co_yellow,l_text:Arial_100:Flowers/fl_layer_apply/flower.jpg "thumb: h_150")

### auto
&nbsp;`b_auto[:<mode>][:<number>][:<direction>][:palette_<color 1>[_..._<color n>]]`

A [qualifier](#parameter_types) that automatically selects the background color based on one or more predominant colors in the image, for use with one of the padding crop mode transformations. 

**Learn more**: [Content-aware padding](./effects_and_artistic_enhancements#content_aware_padding) 

**Use with**: [c_auto_pad - image only](#c_auto_pad) | [c_pad](#c_pad) | [c_lpad](#c_lpad) | [c_mpad](#c_mpad) | [c_fill_pad - image only](#c_fill_pad)

#### Syntax details
| Value              | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mode               | constant | The method to use for determining the solid or gradient color(s) to apply. **Possible values**:To automatically set the background to a single color:`border`: Selects the predominant color, taking only the image border pixels into account. `predominant`: Selects the predominant color while taking all pixels in the image into account.`border_contrast`: Selects the strongest contrasting color to the predominant color, taking only the image border pixels into account.`predominant_contrast`: Selects the strongest contrasting color to the predominant color while taking all pixels in the image into account.To automatically apply a gradient fade to the background with multiple colors:`predominant_gradient`: Bases the gradient fade effect on the predominant colors in the image.`predominant_gradient_contrast`: Bases the gradient fade effect on the colors that contrast the predominant colors in the image.`border_gradient`: Bases the gradient fade effect on the predominant colors in the border pixels of the image.`border_gradient_contrast`: Bases the gradient fade effect on the colors that contrast the predominant colors in the border pixels of the image.**Default:** `border`. |
| number             | integer  | Relevant only when setting `mode` to one of the 'gradient' options. The number of predominant colors to select. **Possible values**: `2`, `4`.**Default**: `2`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| direction          | constant | Relevant only when setting `mode` to one of the 'gradient' options and when 2 colors are selected for the `number` option. Specifies the direction to blend the 2 colors together. (If 4 colors are selected, each gets interpolated between the four corners and this parameter is ignored.) **Possible values**: `horizontal`,  `vertical`, `diagonal_desc`, `diagonal_asc`. **Default**: `horizontal`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| color 1 to color n | string   | The palette of colors to use in the border. For each color, specify either:A 3- or 4-digit RGB/RGBA hex (e.g. f00)An RGB or RGBA hex triplet or quadruplet (6 or 8 digits) (e.g. f2086a)A named color (e.g. blue)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

#### Examples
1. Pad an image to a width and height of 150 pixels, and with the background color set to the predominant color from that image (`b_auto:predominant,c_pad,h_150,w_150`):

    ![predominant background](https://res.cloudinary.com/demo/image/upload/b_auto:predominant,c_pad,h_150,w_150/sheep.jpg)

2. Pad an image to a width and height of 150 pixels, and with the background color set to the 2 most predominant colors from that image, blended in a diagonally descending direction (`b_auto:predominant_gradient:2:diagonal_desc,c_pad,h_150,w_150`):

    ![predominant gradient background](https://res.cloudinary.com/demo/image/upload/b_auto:predominant_gradient:2:diagonal_desc,c_pad,h_150,w_150/sheep.jpg)

3. Pad an image to a width and height of 150 pixels, with a 4 color gradient fade in the auto colored padding, and limiting the possible colors to red, green, blue, and orange (`b_auto:predominant_gradient:4:palette_red_green_blue_orange,c_pad,h_150,w_150`):

    ![predominant gradient background with color palette](https://res.cloudinary.com/demo/image/upload/b_auto:predominant_gradient:4:palette_red_green_blue_orange,c_pad,h_150,w_150/horse.jpg)

### blurred
&nbsp;`b_blurred[:<intensity>][:<brightness>]`

A [qualifier](#parameter_types) that generates a blurred version of the same video to use as the background with the corresponding padded cropping transformation.

**Use with**: [c_pad](#c_pad) | [c_lpad](#c_lpad)

**Learn more**: [Pad with blurred video background](./video_resizing_and_cropping#example_3_pad_with_blurred_video_background)

#### Syntax details
| Value      | Type    | Description                                                                                 |
| ---------- | ------- | ------------------------------------------------------------------------------------------- |
| intensity  | integer | The amount of blurring. **Range**: `1 to 2000`. **Default**: `100`.                         |
| brightness | integer | The brightness of the blurred background video. **Range**: `-300 to 100`. **Default**: `0`. |

#### Example
Pad a portrait video with a blurred background of that same video at an intensity of 400 and a brightness of 15 (`b_blurred:400:15`):

![Portrait video with blurred padding and other transformation effects](https://res.cloudinary.com/demo/video/upload/c_scale,h_320/b_blurred:400:15,c_pad,h_320,w_480/e_volume:mute/e_accelerate:100/cld_rubiks_guy.mp4 "thumb: h_150, width: 224, height: 150, poster: https://res.cloudinary.com/demo/image/upload/h_320,w_480/h_150/rubik_poster.jpg")

### gen_fill
&nbsp;`b_gen_fill[:prompt_<prompt>][;seed_<seed>]`

A [qualifier](#parameter_types) that automatically fills the padded area using generative AI to extend the image seamlessly. Optionally include a prompt to guide the image generation. 

Using different seeds, you can regenerate the image if you're not happy with the result.  You can also use seeds to return a previously generated result, as long as any other preceding transformation parameters are the same.
{note:title=Notes and limitations:}

* Generative fill can only be used on non-transparent images.
* There is a [special transformation count](./transformation_counts#special_effect_calculations) for generative fill.
* Generative fill isn't supported for [animated](./animated_images) images or [fetched](./fetch_remote_images#fetch_and_deliver_remote_files) images.
* If you get blurred results when using this feature, it is likely that the built-in NSFW (Not Safe For Work) check has detected something inappropriate. You can [contact support](https://support.cloudinary.com/hc/en-us/requests/new) to disable this check if you believe it's too sensitive.
* When Cloudinary is generating a derived version, you may get a 423 response returned until the version is ready. You can prepare derived versions in advance using an [eager transformation](./eager_and_incoming_transformations#eager_transformations).
* When Cloudinary is generating an [incoming transformation](./eager_and_incoming_transformations#incoming_transformations), you may get a 420 response returned, with status `pending` until the asset is ready.

{/note}
**Learn more**: [Generative fill](./generative_ai_transformations#generative_fill) 

**Use with**: [c_auto_pad](#c_auto_pad) | [c_pad](#c_pad) | [c_lpad](#c_lpad) | [c_mpad](#c_mpad) | [c_fill_pad](#c_fill_pad)

#### Syntax details
| Value  | Type    | Description                                                                                            |
| ------ | ------- | ------------------------------------------------------------------------------------------------------ |
| prompt | string  | A natural language description of what you want to include in the padding.                             |
| seed   | integer | Any number that can be used either to regenerate a result, or to return a previously generated result. |

#### Examples
1. Seamlessly extend the width of an image to an aspect ratio of 16:9, with a width of 1250 pixels: (`ar_16:9,b_gen_fill,c_pad,w_1250`):

    ![Moped in a street](https://res.cloudinary.com/demo/image/upload/ar_16:9,b_gen_fill,c_pad,w_1250/docs/moped.jpg "thumb:h_150")

2. Seamlessly extend both dimensions of an image using minimum pad to a width and height of 1100 pixels (`b_gen_fill,c_mpad,h_1100,w_1100`):

    ![Generatively filled extra dimensions of a Gaudi mosaic](https://res.cloudinary.com/demo/image/upload/b_gen_fill,c_mpad,h_1100,w_1100/docs/gaudi.jpg "thumb:h_150")

3. The same as example 2, but using a different seed to generate a different result (`b_gen_fill:seed_3,c_mpad,h_1100,w_1100`):

    ![Generatively filled extra dimensions of a Gaudi mosaic](https://res.cloudinary.com/demo/image/upload/b_gen_fill:seed_3,c_mpad,h_1100,w_1100/docs/gaudi.jpg "thumb:h_150")

4. Seamlessly extend the height of an image upwards including bowls of cereal (`b_gen_fill:prompt_bowls%20of%20cereal,c_pad,h_1800,w_1000,g_south`):

    ![Fill in the extra area with bowls of cereal](https://res.cloudinary.com/demo/image/upload/b_gen_fill:prompt_bowls%20of%20cereal,c_pad,h_1800,w_1000,g_south/docs/food.jpg "thumb:h_300")

## bl (baseline)
&nbsp;`bl_<named transformation>`

Establishes a baseline transformation from a [named transformation](./image_transformations#named_transformations). The baseline transformation is cached, so when re-used with other transformation parameters, the baseline part of the transformation does not have to be regenerated, saving processing time and cost. 

This is especially useful for transformations with [special transformation counts](./transformation_counts#special_transformation_counts).

Also consider [eagerly](./eager_and_incoming_transformations) generating a baseline transformation for transformations that take a long time to process. You can do that on upload, using the [upload method](./image_upload_api_reference#upload) or an [upload preset](./upload_presets), or for existing assets using the [explicit method](./image_upload_api_reference#explicit). 
{notes}

* You can combine the baseline transformation with other transformation parameters, but it must be the **first component** in the chain and the **only transformation parameter** in that component.
* You must specify a [supported format transformation](./transformation_reference#f_supported_format) (`f_`) in the named transformation.
* Consider using `f_jxl/q_100` in the baseline transformation to prevent images suffering from loss due to double lossy encoding.
* You cannot use automatic format (`f_auto`) in the named transformation, although this can be used in a subsequent component. 
* If the named transformation contains [variables](./user_defined_variables), the variables must be defined within the named transformation.
* The baseline transformation is not supported for [fetched](./fetch_remote_images#fetch_and_deliver_remote_files) media or [incoming transformations](./eager_and_incoming_transformations#incoming_transformations).

{/notes}

#### Syntax details
| Value                | Type   | Description                                                                   |
| -------------------- | ------ | ----------------------------------------------------------------------------- |
| named transformation | string | **Required**. The named transformation to use as the baseline transformation. |

#### Examples
1. Use a baseline transformation (`bl_bg-rem-gray-jxl`) to remove the background of an image, and apply the grayscale effect, formatted as a JXL with no loss of quality (the named transformation, `bg-rem-gray-jxl` has the underlying transformation, `e_background_removal/f_jxl/q_100/e_grayscale`). Then, apply a cartoonify effect and automatic format and quality (`e_cartoonify/f_auto/q_auto`) :

    ![Add a cartoonify effect to a baseline transformations](https://res.cloudinary.com/demo/image/upload/bl_bg-rem-gray-jxl/e_cartoonify/f_auto/q_auto/cld-sample.jpg "thumb: h_150")

1. Use the same baseline transformation, but resize the image, then add an underlay of the sky at the same size (`bl_bg-rem-gray-jxl/c_fill,h_150/u_docs:sky/c_fill,h_150/fl_layer_apply`):

    ![Baseline transformation with an underlay applied](https://res.cloudinary.com/demo/image/upload/bl_bg-rem-gray-jxl/c_fill,h_150/u_docs:sky/c_fill,h_150/fl_layer_apply/f_auto/q_auto/cld-sample.jpg "thumb: h_150")

1. Use a baseline transformation (`bl_first5-rotate`) to trim a video to the first five seconds, and rotate it 15 degrees, formatted as an MP4 (the named transformation, `first5-rotate` has the underlying transformation, `du_5/f_mp4/a_15`). Then, loop the video twice and let Cloudinary determine the best format and quality (`e_loop:2/f_auto/q_auto`) for delivery:

    ![Baseline transformation followed by looping and optimizations](https://res.cloudinary.com/demo/video/upload/bl_first5-rotate/e_loop:2/f_auto/q_auto/samples/cld-sample-video.mp4 "poster:https://res.cloudinary.com/demo/video/upload/bl_first5-rotate/h_150/q_auto/samples/cld-sample-video.jpg, thumb: h_150")

## bo (border)
&nbsp;`bo_<width>_<style>_<color>`

Adds a solid border around an image or video.

As a [qualifier](#parameter_types), adds a border to an overlay.

**Use with**: [l_\<image id\>](#l_image_id) | [l_fetch](#l_fetch) | [l_subtitles](#l_subtitles) | [l_text](#l_text) | [l_video](#l_video) | [u_\<image id\>](#u_image_id) | [u_fetch](#u_fetch)

**Learn more**: [Adding borders](./effects_and_artistic_enhancements#adding_image_borders)

#### Syntax details
| Value | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| width | string | **Required**. The width of the border in pixels (e.g., `40px`).                                                                                                                                                                                                                                                                                                                                                  |
| style | string | **Required**. Currently, only `solid` is supported for style.                                                                                                                                                                                                                                                                                                                                                    |
| color | string | **Required**. The color can be set as:A 3- or 4-digit RGB/RGBA hex An RGB or RGBA hex triplet or quadruplet (6 or 8 digits). A named colorWhen specifying any RGB or RGBA value, always prefix the color value in the URL with `rgb:` (without `#`). For example, `bo_5px_solid_rgb:999` or `bo_5px_solid_rgb:FEB61FC2`. When using a named color, specify only the color name. For example `bo_5px_solid_blue`. |

#### Examples
1. Add a 40-pixel wide brown border to the image (`bo_40px_solid_brown`):

    ![A 40 pixels wide brown border](https://res.cloudinary.com/demo/image/upload/bo_40px_solid_brown/autumn_leaves.jpg "thumb: h_150")

1. Add a 60-pixel wide border of a semi transparent (RGBA hex quadruplet) color - the last 2 digits are the hex value of the alpha channel (`bo_60px_solid_rgb:00390b60`):

    ![A 60 pixels wide border of a semi transparent RGB color](https://res.cloudinary.com/demo/image/upload/bo_60px_solid_rgb:00390b60/autumn_leaves.jpg "thumb: h_150")

1. Add multiple 200-pixel wide borders (blue, red and green) to an image, (`bo_200px_solid_blue/bo_200px_solid_red/bo_200px_solid_green`):

    ![A 40 pixels wide brown border](https://res.cloudinary.com/demo/image/upload/bo_200px_solid_blue/bo_200px_solid_red/bo_200px_solid_green/autumn_leaves.jpg "thumb: h_150")

## br (bitrate)

&nbsp;

Controls the bitrate for audio or video files in bits per second. Includes the option to use either variable bitrate (default), with the bitrate value indicating the maximum bitrate, or constant bitrate. If specifying just a bitrate value, the same bitrate is used for both video and audio (if both are present). To control each separately, use [br_av](#br_av).

Supported for video codecs: `h264`, `h265 (MPEG-4)`; `vp8`, `vp9 (WebM)`
Supported for audio codecs: `aac`, `mp3`, `vorbis`

**Learn more**: [Bitrate control](./video_optimization#bitrate_control)

### \<bitrate value\>
&nbsp;`br_<bitrate value>[:constant]`

Controls the bitrate for audio or video files in bits per second.

#### Syntax details
| Value         | Type                  | Description                                                                                                                                                                                           |
| ------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bitrate value | integer &#124; string | **Required**. The maximum number of bits per second (e.g., `500000`). Can also be specified as a string, supporting `k` and `m` for kilobits and megabits respectively (e.g., `500k` or `1m`).        |
| constant      | keyword               | If `constant` is specified, the video or audio file plays with a constant bitrate (CBR) and the default `quality` setting (or any [q (quality)](#q_quality) setting explicitly specified) is ignored. |

#### Examples
1. Set a maximum bitrate of 500000 (`br_500000`):

    ![A bitrate of 500000](https://res.cloudinary.com/demo/video/upload/br_500000/docs/parrot.mp4 "thumb: h_250, muted:false")

1. Set a constant bitrate of 500k (`br_500k:constant`):

    ![A constant bitrate of 500k](https://res.cloudinary.com/demo/video/upload/br_500k:constant/docs/parrot.mp4 "thumb: h_250, muted:false")

### av
&nbsp;`br_av:video(value_<bitrate_value>[;mode_<bitrate_mode>]);audio_(value_<bitrate_value>)`

Controls the video and audio bitrate separately to allow for more fine-tuned control.

#### Syntax details
| Value         | Type                  | Description                                                                                                                                                                                                                                         |
| ------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bitrate value | integer &#124; string | **Required**. The maximum number of bits per second (e.g., `500000`). Can also be specified as a string, supporting `k` and `m` for kilobits and megabits respectively (e.g., `500k` or `1m`).                                                      |
| bitrate mode  | string                | The bitrate mode to use for video bitrate. **Possible values**: `vbr`, `cbr`. **Default**: `vbr`. If setting as constant bitrate (`cbr`), the default `quality` setting (or any [q (quality)](#q_quality) setting explicitly specified) is ignored. |

#### Examples
1. Set a video bitrate of 2m and audio bitrate of 128k (`br_av:video_(value_2m);audio_(value_128k)`):

    ![A video bitrate of 2m and audio bitrate of 128k](https://res.cloudinary.com/demo/video/upload/br_av:video_(value_2m);audio_(value_128k)/docs/parrot.mp4 "with_code: false, thumb: h_250, muted:false")

1. Set a video bitrate of 500k using constant bitrate (`br_av:video_(value_500k;mode_cbr)`):

    ![A video bitrate of 500k using constant bitrate](https://res.cloudinary.com/demo/video/upload/br_av:video_(value_500k;mode_cbr)/docs/parrot.mp4 "with_code: false, thumb: h_250, muted:false")

## c (crop/resize)

&nbsp;

Changes the size of the delivered asset according to the requested width & height dimensions. 

Depending on the selected `<crop mode>`, parts of the original asset may be cropped out and/or the asset may be resized (scaled up or down). 

When using any of the modes that can potentially crop parts of the asset, the selected [gravity](#g_gravity) parameter controls which part of the original asset is kept in the resulting delivered file.

[//]: # ([crop](#c_crop) |[fill](#c_fill) |[fill_pad](#c_fill_pad) | [fit](#c_fit) |[imagga_crop](#c_imagga_crop) |[imagga_scale](#c_imagga_scale) |[lfill](#c_lfill) |[limit](#c_limit) |[lpad](#c_lpad) |[mfit](#c_mfit) | [mpad](#c_mpad) | [pad](#c_pad) | [scale](#c_scale) |[thumb](#c_thumb)  ) 
      
**Learn more**: [Resizing and cropping images](./resizing_and_cropping) | [Resizing and cropping videos](./video_resizing_and_cropping)

### auto
&nbsp;`c_auto`

Automatically determines the best crop based on the gravity and specified dimensions.

If the requested dimensions are smaller than the best crop, the result is downscaled. If the requested dimensions are larger than the original image, the result is upscaled. Use this mode in conjunction with the [g (gravity)](#g_gravity) parameter.

#### Required qualifiers
[g (gravity)](#g_gravity)

&nbsp;&nbsp;&nbsp;&nbsp;And 

Two of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

**Learn more**: [Automatic gravity with the automatic cropping mode](./resizing_and_cropping#automatic_gravity_with_the_auto_cropping_mode)

#### Example
Create a 16:9 aspect ratio crop of an image of two smiling ladies, automatically deciding which parts of the image to keep (`c_auto,g_auto,ar_16:9,h_150`):
    
![Smiling ladies](https://res.cloudinary.com/demo/image/upload/c_auto,g_auto,ar_16:9,h_150/docs/ladies-smiling.jpg)

### auto_pad
&nbsp;`c_auto_pad`

Tries to prevent a "bad crop" by first attempting to use the `auto` cropping mode, but adding some padding if the algorithm determines that more of the original image needs to be included in the final image. Especially useful if the aspect ratio of the delivered asset is considerably different from the original's aspect ratio. Supported only in conjunction with [g_auto](#g_auto).

{note}
Not supported for [animated images](./animated_images).
{/note}

#### Required qualifiers
[g_auto](#g_auto)

&nbsp;&nbsp;&nbsp;&nbsp;And 

Two of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

#### Optional qualifiers
[b (background)](#b_background)

#### Example
Deliver an image as a 300 x 160 image using the `auto_pad` mode. (`b_auto,c_auto_pad,g_auto,h_160,w_300`). 
Compare this to the same image delivered using the regular `auto` cropping mode (shown below on the right).
  
![auto_pad](https://res.cloudinary.com/demo/image/upload/b_auto,c_auto_pad,g_auto,h_160,w_300/docs/men-laughing.jpg "with_image: false")

auto_pad  

auto

### crop
&nbsp;`c_crop`

[//]: # (need to redo the following desc - see important clarifications- & potential changes to x/y behavior with crop CORE-1904)

Extracts the specified size from the original image without distorting or scaling the delivered asset. 

By default, the center of the image is kept (extracted) and the top/bottom and/or side edges are evenly cropped to achieve the requested dimensions. You can specify the [gravity](#g_gravity) qualifier to control which part of the image to keep, either as a [compass direction](#g_compass_position) (such as `south` or `north_east`), one of the [special gravity positions](#g_special_position) (such as `faces` or `ocr_text`), [AI-based automatic region detection](#g_auto) or [AI-based object detection](#g_object).

You can also specify a specific region of the original image to keep by specifying [x and y qualifiers](#x_y_coordinates) together with [w (width)](#w_width) and [h (height)](#h_height) qualifiers to define an exact bounding box. When using this method, and no gravity is specified, the `x` and `y` coordinates are relative to the top-left (north-west) corner of the original asset. You can also use percentage based numbers instead of the exact coordinates for `x`, `y`, `w` and `h` (e.g., 0.5 for 50%). Use this method only when you already have the required absolute cropping coordinates. For example, you might use this if your application allows a user to upload [user-generated content](./user_generated_content), and your application allows the user to manually select a region to crop from the original image, and you pass those coordinates to build the crop URL. 

#### Required qualifiers
Two of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

#### Optional qualifiers
[g (gravity)](#g_gravity) | [x (x-coordinate)](#x_y_coordinates) | [y (y-coordinate)](#x_y_coordinates)

#### Example
Crop an image to a width of 200 pixels, a height of 150 pixels, with south gravity (`c_crop,g_south,h_150,w_200`):

![Image cropped to 100x150 with south gravity](https://res.cloudinary.com/demo/image/upload/c_crop,g_south,h_150,w_200/docs/flower_shop.jpg)

### fill
&nbsp;`c_fill`

Creates an asset with the exact specified width and height without distorting the asset. This option first scales as much as needed to at least fill both of the specified dimensions. If the requested aspect ratio is different than the original, cropping will occur on the dimension that exceeds the requested size after scaling. You can specify which part of the original asset you want to keep if cropping occurs using the [gravity](#g_gravity) (set to 'center' by default).

#### Required qualifiers
At least one of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

#### Optional qualifiers
[g (gravity)](#g_gravity)

#### Examples
1. Fill to a width and height of 150 pixels (`c_fill,h_150,w_150`):

    ![Image filled to a width and height of 150 pixels](https://res.cloudinary.com/demo/image/upload/c_fill,h_150,w_150/docs/camera-640.jpg)

1. Fill to a width and height of 150 pixels with east gravity (`c_fill,g_east,h_150,w_150`):

    ![Image filled to a width and height of 150 pixels with east gravity](https://res.cloudinary.com/demo/image/upload/c_fill,g_east,h_150,w_150/docs/camera-640.jpg)

### fill_pad
&nbsp;`c_fill_pad`

Tries to prevent a "bad crop" by first attempting to use the `fill` mode, but adding some padding if the algorithm determines that more of the original image needs to be included in the final image, or if more content in specific frames in a video should be shown. Especially useful if the aspect ratio of the delivered asset is considerably different from the original's aspect ratio. Supported only in conjunction with [g_auto](#g_auto).

{note}
Not supported for [animated images](./animated_images).
{/note}

#### Required qualifiers
[g_auto](#g_auto)

&nbsp;&nbsp;&nbsp;&nbsp;And 

Two of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

#### Optional qualifiers
[b (background) - image only](#b_background)

#### Example
Deliver an image as a 25 x 150 image using the `fill_pad` mode. (`b_auto,c_fill_pad,g_auto,h_150,w_25`). 
Compare this to the same image delivered using the regular `fill` mode (shown below on the right).
  

fill_pad  

fill

![fill_pad](https://res.cloudinary.com/demo/image/upload/b_auto,c_fill_pad,g_auto,h_400,w_80/lady.jpg "with_image: false")

### fit
&nbsp;`c_fit`

Scales the asset up or down so that it takes up as much space as possible within a bounding box defined by the specified dimension parameters without cropping any of it. The original aspect ratio is retained and all of the original image is visible.

#### Required qualifiers
Two of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

#### Example
Fit an image within a width and height of 150 pixels (`c_fit,h_150,w_150`).

![fit within 150x150](https://res.cloudinary.com/demo/image/upload/c_fit,h_150,w_150/docs/camera-640.jpg)

### imagga_crop
&nbsp;`c_imagga_crop`

Requires the [Imagga Crop and Scale add-on](./imagga_crop_and_scale_addon). The Imagga Crop and Scale add-on can be used to smartly crop your images based on areas of interest within each specific photo as automatically calculated by the Imagga algorithm.

#### Required qualifiers
At least one of the following: [w (width)](#w_width) | [h (height)](#h_height)

#### Optional qualifiers
[ar (aspect_ratio)](#ar_aspect_ratio)

#### Example
Automatically crop an image with Imagga cropping (`c_imagga_crop`):

![Image with Imagga cropping](https://res.cloudinary.com/demo/image/upload/c_imagga_crop/family_bench.jpg "thumb: h_150")

### imagga_scale
&nbsp;`c_imagga_scale`

Requires the [Imagga Crop and Scale add-on](./imagga_crop_and_scale_addon). The Imagga Crop and Scale add-on can be used to smartly scale your images based on automatically calculated areas of interest within each specific photo.

#### Required qualifiers
At least one of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

#### Example
Automatically scale an image with Imagga scaling and crop if needed (`c_imagga_scale,h_150,w_150`):

![Image with Imagga scaling](https://res.cloudinary.com/demo/image/upload/c_imagga_scale,h_150,w_150/sample_van.jpg)

### lfill
&nbsp;`c_lfill`

The `lfill` (limit fill) mode is the same as [fill](#c_fill) but only if the original image is larger than the specified resolution limits, in which case the image is scaled down to fill the specified width and height without distorting the image, and then the dimension that exceeds the request is cropped. If the original dimensions are smaller than the requested size, it is not resized at all. This prevents upscaling. You can specify which part of the original image you want to keep if cropping occurs using the [gravity](#g_gravity) parameter (set to `center` by default).

#### Required qualifiers
Two of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

#### Optional qualifiers
[g (gravity)](#g_gravity)

#### Example
Limit-fill an image to a width and height of 150 pixels (`c_lfill,h_150,w_150`):

![Image limit-filled to a width and height of 150 pixels](https://res.cloudinary.com/demo/image/upload/c_lfill,h_150,w_150/docs/camera-640.jpg)

### limit
{actionType}&nbsp;`c_limit`

Same as the [fit](#c_fit) mode but only if the original asset is larger than the specified limit (width and height), in which case the asset is scaled down so that it takes up as much space as possible within a bounding box defined by the specified width and height parameters. The original aspect ratio is retained (by default) and all of the original asset is visible. This mode doesn't scale up the asset if your requested dimensions are larger than the original image size.

#### Required qualifiers
Two of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

#### Example
Limit an image to a width and height of 150 pixels (`c_limit,h_150,w_150`):

![Image limited to a width and height of 150 pixels](https://res.cloudinary.com/demo/image/upload/c_limit,h_150,w_150/docs/camera-640.jpg)

{/actionType}

### lpad
&nbsp;`c_lpad`

The `lpad` (limit pad) mode is the same as [pad](#c_pad) but only if the original asset is larger than the specified limit (width and height), in which case the asset is scaled down to fill the specified width and height while retaining the original aspect ratio (by default) and with all of the original asset visible. This mode doesn't scale up the asset if your requested dimensions are bigger than the original asset size. Instead, if the proportions of the original asset do not match the requested width and height, padding is added to the asset to reach the required size. You can also specify where the original asset is placed by using the [gravity](#g_gravity) parameter (set to `center` by default). Additionally, you can specify the color of the [background](#b_background) in the case that padding is added.

You can use the `lpad` resize mode as a way of applying padding to all sides of an asset, like a border, or frame.

#### Required qualifiers
Two of the following:  [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

#### Optional qualifiers
[g_\<gravity position\>](#g_compass_position) | [b (background)](#b_background)

#### Examples
1. Limit-pad an image with a green background to a width of 400 pixels and a height of 150 pixels (`b_green,c_lpad,h_150,w_400`):
    ![Image limit-padded to a width and height of 250 pixels](https://res.cloudinary.com/demo/image/upload/b_green,c_lpad,h_150,w_400/docs/camera-640.jpg)

1. Apply padding to all sides of a video by specifying a bounding box that's square, and has a width of 1.1 times the original width (`ar_1.0,b_green,c_lpad,w_1.1`):
    ![Video padded on both sides](https://res.cloudinary.com/demo/video/upload/ar_1.0,b_green,c_lpad,w_1.1/guy_woman_mobile.mp4 "thumb:c_scale,w_200, width:200")

### mfit
&nbsp;`c_mfit`

The `mfit` (minimum fit) mode is the same as [fit](#c_fit) but only if the original image is smaller than the specified minimum (width and height), in which case the image is scaled up so that it takes up as much space as possible within a bounding box defined by the specified width and height parameters. The original aspect ratio is retained (by default) and all of the original image is visible. This mode doesn't scale down the image if your requested dimensions are smaller than the original image's.

#### Required qualifiers
Two of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

#### Example
Request to fit a large image to a minimum width and height of 20 pixels while retaining the aspect ratio. This results in delivering the original image  without resizing it (`c_mfit,h_20,w_20`):

![Image mfit to a width and height of 20 pixels](https://res.cloudinary.com/demo/image/upload/c_mfit,h_20,w_20/docs/camera-640.jpg)

### mpad
&nbsp;`c_mpad`

The `mpad` (minimum pad) mode applies padding to fill the whole area specified by the dimensions if those dimensions are larger than the original image's dimensions. This mode doesn't scale down the image if the requested dimensions are smaller than the original image's. In that case, the original image is delivered. You can also specify where the original image is placed by using the [gravity](#g_gravity) parameter (set to `center` by default). Additionally, you can specify the color of the [background](#b_background) in the case that padding is added.

You can use the `mpad` resize mode as a way of applying padding to all sides of an image, like a border, or frame.

#### Required qualifiers
Two of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

#### Optional qualifiers
[g_\<gravity position\>](#g_compass_position) | [b (background)](#b_background)

#### Examples
1. Request to pad a large image to a minimum width and height of 20 pixels while retaining the aspect ratio. This results in delivering the original larger image (`c_mpad,h_20,w_20`):
![Image minimum padded to a width and height of 20 pixels](https://res.cloudinary.com/demo/image/upload/c_mpad,h_20,w_20/docs/camera-640.jpg "thumb: h_150")
1. Request to pad with a green background, a 100-pixel wide image to a minimum width and height of 150 pixels while retaining the aspect ratio (`b_green,c_mpad,h_150,w_150`):
![Image minimum padded to a width and height of 150 pixels](https://res.cloudinary.com/demo/image/upload/b_green,c_mpad,h_150,w_150/docs/camera-100.jpg "thumb: h_150")

### pad
&nbsp;`c_pad`

Resizes the asset to fill the specified width and height while retaining the original aspect ratio (by default) and with all of the original asset visible. If the proportions of the original asset do not match the specified width and height, padding is added to the asset to reach the required size. You can also specify where the original asset is placed using the [gravity](#g_gravity) parameter (set to `center` by default). Additionally, you can specify the color of the [background](#b_background) in the case that padding is added.

If you're looking to apply padding to all sides of an asset, consider using [c_lpad](#c_lpad) or [c_mpad](#c_mpad).
  
#### Required qualifiers
Two of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

#### Optional qualifiers
[g_\<gravity position\>](#g_compass_position) | [b (background)](#b_background)

#### Example
Pad an image with a black background to a width and height of 150 pixels (`b_black,c_pad,h_150,w_150`):

![Image padded to a width and height of 150 pixels](https://res.cloudinary.com/demo/image/upload/b_black,c_pad,h_150,w_150/docs/camera-640.jpg)

### scale
&nbsp;`c_scale`

Resizes the asset exactly to the specified width and height. All original asset parts are visible, but might be stretched or squashed if the dimensions you request have a different aspect ratio than the original. 

If [only width or only height](./resizing_and_cropping#one_resize_qualifier) is specified, then the asset is scaled to the new dimension while retaining the original aspect ratio (unless you also include the [fl_ignore\_aspect\_ratio](#fl_ignore_aspect_ratio) flag).

#### Required qualifiers
At least one of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

#### Optional qualifiers
[fl\_ignore\_aspect\_ratio](#fl_ignore_aspect_ratio) | [g_liquid](#g_special_position)

**See also**: [Liquid rescaling](./resizing_and_cropping#liquid_rescaling)

#### Examples
1. Scale to a width of 150 pixels (maintains the aspect ratio by default) (`c_scale,w_150`):

    ![Image scaled to a width of 150 pixels](https://res.cloudinary.com/demo/image/upload/c_scale,w_150/docs/camera-640.jpg)

1. Scale to a width and height of 150 pixels (does not maintain the aspect ratio) (`c_scale,h_150,w_150`):

    ![Image scaled to a width and height of 150 pixels](https://res.cloudinary.com/demo/image/upload/c_scale,h_150,w_150/docs/camera-640.jpg)

### thumb
&nbsp;`c_thumb`

Creates image thumbnails based on a gravity position. Must always be accompanied by the [g (gravity)](#g_gravity) parameter. This cropping mode generates a thumbnail of an image with the exact specified width and height dimensions and with the original proportions retained, but the resulting image might be scaled to fit in the specified dimensions. You can specify the [z (zoom)](#z_zoom) parameter to determine how much to scale the resulting image within the specified width and height.

#### Required qualifiers
[g (gravity)](#g_gravity)

&nbsp;&nbsp;&nbsp;&nbsp;And 

Two of the following: [w (width)](#w_width) | [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio)

(In rare cases, you may choose to [provide only one sizing qualifier](./resizing_and_cropping#one_resize_qualifier))

#### Optional qualifiers
[z (zoom)](#z_zoom)

#### Example
Crop an image to a 150x150 thumbnail using face detection (`c_thumb,g_face,h_150,w_150`):

![150x150 thumbnail with face detection](https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,h_150,w_150/woman.jpg)

## co (color)

&nbsp;`co_<color value>`

A [qualifier](#parameter_types) that specifies the color to use with the corresponding transformation.  

**Use with**: [e\_colorize](#e_colorize) | [e\_outline](#e_outline) | [e\_make\_transparent](#e_make_transparent) | [e\_shadow](#e_shadow) | [l\_text](#l_text) | [l\_subtitles](#l_subtitles) | [fl_waveform](#fl_waveform) 

#### Syntax details
| Value       | Type   | Description                                                                                                                                                                                                                                                                                                                                                                               |
| ----------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| color value | string | **Required.** The color to apply. It can be set as:A 3- or 4-digit RGB/RGBA hex An RGB or RGBA hex triplet or quadruplet (6 or 8 digits). A named colorWhen specifying any RGB or RGBA value, always prefix the value in the URL with `rgb:` (without `#`). For example, `co_rgb:FEB61FC2` or `co_rgb:999`. When using a named color, specify only the color name. For example `co_blue`. |

#### Examples
1. Apply a colorize effect to an image, using an RGB hex triplet to define the green color for the colorize effect (`co_rgb:20a020,e_colorize:50`).
    ![Apply green colorization to a photo](https://res.cloudinary.com/demo/image/upload/co_rgb:20a020,e_colorize:50/face_top.jpg "thumb: h_150")
2. Outline a transparent shape, using 'orange' as the outline color (`co_orange,e_outline`).
    ![Use an orange color for the outline of a transparent shape.](https://res.cloudinary.com/demo/image/upload/co_orange,e_outline/ring2.png "thumb: h_150")

## cs (color space)
&nbsp;`cs_<color space mode>`

Controls the color space (RGB, sRGB, CMYK, custom ICC, etc) used for the delivered image or video. 
If you don't include this parameter in your transformation, the color space of the original asset is generally retained. In some cases for videos, the color space is normalized for web delivery, unless `cs_copy` is specified.

#### Syntax details
| Value            | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| color space mode | constant | **Required.** The color space mode to use when delivering the image or video. **Possible values**:`sRGB`: Renders the image or video in the sRGB color space.`tinysrgb`: Renders the image or video using Facebook's truncated sRGB color space.`cmyk`: Renders the image or video in the CMYK color space.`no_cmyk`: If the original image or video used the CMYK color space, converts it to sRGB.`keep_cmyk`: Retains the CMYK color space when generating derived images or videos.`srgb:truecolor`: **Image only**. Encodes the image as RGB, rather than palette or grayscale. Not applicable when using [q_auto](#q_auto).`cs_icc:[public_id]`: **Image only**. Renders the image using the specified color space (ICC) file. You must upload the **.icc** file as a [raw](./upload_parameters#uploading_non_media_files_as_raw_files) and [authenticated](./upload_parameters#authenticated_assets) file. Specify the public ID of your ICC file including the file extension.`copy`: **Video only**. Retains the original color space of the video. This prevents the color space from being normalized when the video is re-encoded by Cloudinary if another transformation is applied. |

#### Examples
1. Render an image in the sRGB color space (`cs_srgb`).
![Render image in sRGB color space](https://res.cloudinary.com/demo/image/upload/cs_srgb/face_top.jpg "thumb: h_150")
1. Apply CMYK color space (`cs_cmyk`).
![Convert an image to CMYK color space when generating a derived image](https://res.cloudinary.com/demo/image/upload/cs_cmyk/face_top.jpg "thumb: h_150")

## d (default image)
&nbsp;`d_<image asset>`

Specifies a backup placeholder image to be delivered in the case that the actual requested delivery image or social media picture does not exist. Any requested transformations are applied on the placeholder image as well. 
{notes}

* If the requested image does not exist and the default placeholder image is delivered instead, the `x_cld_error` header will also be included in the response.
* The default placeholder image must be of [type](./image_transformations#delivery_types) `upload`, i.e. publicly available.

{/notes}
**Learn more**: [Using a default image placeholder](./advanced_url_delivery_options#using_a_default_image_placeholder)

#### Syntax details
| Value       | Type   | Description                                                                                                            |
| ----------- | ------ | ---------------------------------------------------------------------------------------------------------------------- |
| image asset | string | **Required.** The public ID of the placeholder image plus the file extension. Replace any forward slashes with colons. |

#### Example
Return the image with public ID `docs/placeholders/samples/avatar` as a PNG if the requested image in the URL `non_existing_id` does not exist (`d_docs:placeholders:samples:avatar.png`).

![Return the avatar image if an image with the ID of 'non_existing_id' does not exist](https://res.cloudinary.com/demo/image/upload/d_docs:placeholders:samples:avatar.png/non_existing_id.png "thumb: h_150")

## dl (delay)
&nbsp;`dl_<time value>`

Controls the time delay between the frames of a delivered animated image. (The source asset can be an image or a video.)

**Related flag**: [fl_animated](#fl_animated)

#### Syntax details
| Value | Type    | Description                                             |
| ----- | ------- | ------------------------------------------------------- |
| time  | integer | **Required.** The delay in milliseconds between frames. |

#### Example
Convert a video to an animated image, and apply a delay of 200 milliseconds between frames (`dl_200`).

![Deliver an animated image based on a video with a delay between frames of 200 milliseconds](https://res.cloudinary.com/demo/video/upload/dl_200/surfers.gif "thumb: h_150")

## dn (density)
&nbsp;`dn_<dots per inch>`

Controls the density to use when delivering an image or when converting a vector file such as a PDF or EPS document to a web image delivery format.

* **For web image formats**: By default, if an image does not contain resolution information in its embedded metadata, Cloudinary normalizes any derived images for web optimization purposes and delivers them at 150 DPI. Controlling the DPI can be useful when generating a derived image intended for printing. 
  {tip}
  You can take advantage of the **idn** (initial density) value to automatically set the density of your image to the (pre-normalized) initial density of the original image (for example, `dn_idn`). This value is taken from the original image's metadata.
  {/tip}

* **For vector files (PDF, EPS, etc.)**: When you deliver a vector file in a web image format, it is delivered by default at 150 DPI.

{note}
When [automatic quality](./image_optimization#automatic_quality_selection_q_auto) (`q_auto` in URLs) is applied to the delivered image, either due to the [default image quality](./image_optimization#default_image_quality) setting or as a URL transformation parameter, the DPI and resolution metadata are effectively stripped (the fields exist but you shouldn't rely on the values). This is true even if you set the `dn` parameter. To prevent this behavior, provide a quality value in the delivery URL, such as `q_80`. 
{/note} 

**See also**: [Arithmetic expressions](./user_defined_variables#arithmetic_expressions)

**Learn more**: [Deliver a PDF page as an image](./paged_and_layered_media#deliver_a_selected_pdf_page_as_an_image)

#### Syntax details
| Value         | Type    | Description                                   |
| ------------- | ------- | --------------------------------------------- |
| dots per inch | integer | **Required.** The DPI of the delivered image. |

#### Example
Deliver a JPEG image of the first page of the PDF file with a density of 20 (`dn_20`):

![JPEG image of the PDF with 20 density](https://res.cloudinary.com/demo/image/upload/dn_20/multi_page_pdf.jpg "thumb: h_150")

## dpr (DPR)
&nbsp;

Sets the device pixel ratio (DPR) for the delivered image or video using a specified value or automatically based on the requesting device.

[//]: # ([\<pixel_ratio\>](#dpr_pixel_ratio) | [auto](#dpr_auto) )

### \<pixel ratio\>
&nbsp;`dpr_<pixel ratio>`

Delivers the image or video in the specified device pixel ratio.
{note}
When setting a DPR value, you must also include a [crop/resize transformation](./transformation_reference#c_crop_resize) specifying a certain width or height.
{/note}
{info}
When delivering at a DPR value larger than `1`, ensure that you also set the desired final display dimensions in your image or video tag. For example, if you set `c_scale,h_300/dpr_2.0` in your delivery URL, you should also set `height=300` in your image tag. Otherwise, the image will be delivered at 2.0 x the requested dimensions (a height of 600px in this example).
{/info}

**Learn more**: [Set Device Pixel Ratio (DPR)](./resizing_and_cropping#set_device_pixel_ratio_dpr)

**See also**: [Arithmetic expressions](./user_defined_variables#arithmetic_expressions)

#### Syntax details
| Value       | Type  | Description                                                                                          |
| ----------- | ----- | ---------------------------------------------------------------------------------------------------- |
| pixel ratio | float | **Required.** A positive value for the device pixel ratio to use when delivering the image or video. |

#### Example
Deliver the image with a dpr of 2.0 (`dpr_2.0`). 

{note}
While the code example below shows only the transformation URL, the image tag for the displayed inline image includes a hard-coded **height** definition in the image tag, to ensure that the doubled-DPR is still delivered within a display of 150px. If you view just the transformed `dpr_2.0` URL outside the image tag, it displays with a height of 300px.

```
<img title="Deliver the image with a dpr of 2.0" 
    alt="Deliver the image with a dpr of 2.0" 
    style="margin: 0 auto;display: block" 
    src="https://res.cloudinary.com/demo/image/upload/c_scale,h_150/dpr_2.0/face_top.jpg"
    height="150" 
>
```
{/note}

![Deliver the image with a dpr of 2.0](https://res.cloudinary.com/demo/image/upload/c_scale,h_150/dpr_2.0/face_top.jpg "height:150")

### auto
&nbsp;`dpr_auto`

Delivers the image in a resolution that automatically matches the DPR (Device Pixel Ratio) setting of the requesting device, rounded up to the nearest integer. Only works for certain browsers and when **Client-Hints** are enabled. 

**Learn more**: [Automatic DPR](./responsive_server_side_client_hints#automatic_pixel_density_detection)

#### Example
Deliver the image with a DPR automatically set (`dpr_auto`).

![Deliver the image with a DPR automatically set](https://res.cloudinary.com/demo/image/upload/c_scale,h_150/dpr_auto/face_top.jpg "height:150")

## dr (dynamic range)
&nbsp;

Sets the dynamic range for video output, controlling whether the video is delivered in HDR (High Dynamic Range) or SDR (Standard Dynamic Range).

**Learn more**: [HDR video transformations](./video_manipulation_and_delivery#hdr_video_transformations)

### high
&nbsp;`dr_high`

Requests HDR10 (High Dynamic Range) output for the video. When combined with `vc_h265`, Cloudinary performs direct transcoding while preserving the HDR10 color-grading and metadata from the source video.

**Learn more**: [HDR video transformations](./video_manipulation_and_delivery#hdr_video_transformations)

{notes}

* HDR video encoding uses the HEVC video codec in Main10 profile with 10-bit pixels. You must use `dr_high` together with `vc_h265` to request HDR output.
* Cloudinary performs direct transcoding, preserving color-grading and HDR metadata. Conversions between different HDR formats (e.g., HDR10 to Dolby Vision) aren't supported.
* If the source video can't be delivered as HDR (e.g., missing metadata, incorrect format, non-HLG/HDR10 compliant), Cloudinary automatically falls back to SDR output with no additional charge.

{/notes}

#### Examples
1. Request HDR output with HEVC codec (`dr_high,vc_h265`):

    ![HDR video with HEVC codec](https://res.cloudinary.com/demo/video/upload/dr_high,vc_h265/docs/hdr_turtle.mp4 "thumb: h_150, with_code: false")

2. Request HDR output with resizing (`c_scale,w_1280/dr_high,vc_h265`):

    ![HDR video resized to 1280px width](https://res.cloudinary.com/demo/video/upload/c_scale,w_1280/dr_high,vc_h265/docs/hdr_turtle.mp4 "thumb: h_150, with_code: false")

## du (duration)
&nbsp;`du_<time value>`

Sets the duration (in seconds) of a video or audio clip.  

* Can be used independently to **trim** a video or audio clip to the specified length. This parameter is often used in conjunction with the [so (start offset)](#so_start_offset) and/or [eo (end offset)](#eo_end_offset) parameters.
* Can be used as a [qualifier](#parameter_types) to control the length of time for a corresponding transformation.

**As a qualifier, use with**: [e\_boomerang](#e_boomerang) | [l\_audio](#l_audio) | [l\_\<image id>](#l_image_id) | [l\_video](#l_video) 

#### Syntax details
| Value      | Type                | Description                                                                                                                                  |
| ---------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| time value | float &#124; string | **Required.** Specify the duration as either: The time in seconds (e.g. `6.12`).The time as a percentage of the whole duration (e.g. `60p`). |

#### Examples
1. Deliver a video with a duration of 3 seconds (`du_3`):

    ![Paradise view with duration of 3 seconds](https://res.cloudinary.com/demo/video/upload/du_3/paradise_location.mp4 "thumb: h_150")

2. Deliver a video with a duration of 30% (`du_30p`) and a start offset of 6 seconds  into the video (`so_6`):

    ![Paradise vide with duration 30% and start offset 6 seconds](https://res.cloudinary.com/demo/video/upload/du_30p,so_6/paradise_location.mp4 "thumb: h_150")

## e (effect)
&nbsp;

Applies the specified effect to an asset.

{note}

If you specify more than one effect in a transformation component (separated by commas), only the last effect in that component is applied. 

To combine effects, use separate components (separated by forward slashes) following best practice guidelines, which recommend including only one [action parameter](./image_transformations#parameter_types) per component.

{/note}

[//]: # ([accelerate](#e_accelerate) | [adv_redeye](#e_adv_redeye) | [anti_removal](#e_anti_removal) | [art](#e_art) | [auto_brightness](#e_auto_brightness) | [auto_color](#e_auto_color) | [auto_contrast](#e_auto_contrast) | [assist_colorblind](#e_assist_colorblind) | [bgremoval](#e_bgremoval) | [blackwhite](#e_blackwhite) | [blue](#e_blue) | [blur](#e_blur) | [blur_faces](#e_blur_faces) | [blur_region](#e_blur_region) | [boomerang](#e_boomerang) | [brightness](#e_brightness) | [brightness hsb](#e_brightness_hsb) | [cartoonify](#e_cartoonify) | [colorize](#e_colorize) | [contrast](#e_contrast) | [cut_out](#e_cut_out) | [deshake](#e_deshake) | [distort](#e_distort) | [displace](#e_displace) | [fade](#e_fade) | [fill_light](#e_fill_light) | [gamma](#e_gamma) | [gradient_fade](#e_gradient_fade) | [grayscale](#e_grayscale) | [green](#e_green) | [hue](#e_hue) | [improve](#e_improve) | [loop](#e_loop) | [make_transparent](#e_make_transparent) | [multiply](#e_multiply) | [negate](#e_negate) | [noise](#e_noise) | [oil_paint](#e_oil_paint) | [opacity_threshold](#e_opacity_threshold) | [ordered_dither](#e_ordered_dither) | [outline](#e_outline) | [overlay](#e_overlay) | [pixelate](#e_pixelate) | [pixelate_faces](#e_pixelate_faces) | [pixelate_region](#e_pixelate_region) | [preview](#e_preview) | [progressbar](#e_progressbar) | [recolor](#e_recolor) |  [red](#e_red) | [redeye](#e_redeye) | [replace_color](#e_replace_color) | [reverse](#e_reverse) | [saturation](#e_saturation) | [sepia](#e_sepia) | [screen](#e_screen) | [shadow](#e_shadow) | [sharpen](#e_sharpen) | [shear](#e_shear) | [simulate_colorblind](#e_simulate_colorblind) | [theme](#e_theme) | [tint](#e_tint) | [transition](#e_transition) | [trim](#e_trim) | [unsharp_mask](#e_unsharp_mask) | [vectorize](#e_vectorize) | [vibrance](#e_vibrance) | [viesus_correct](#e_viesus_correct) | [vignette](#e_vignette) | [volume](#e_volume))

### accelerate
&nbsp;`e_accelerate[:<acceleration percentage>]`

Speeds up the video playback by the specified percentage.

#### Syntax details
| Value                   | Type    | Description                                                                                                              |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| acceleration percentage | integer | The acceleration percentage. A negative value slows down the playback speed.  **Range**: `-50 to 100`. **Default**: `0`. |

#### Example
Speed up the playback of a video by 100% - twice normal speed (`e_accelerate:100`):

![video accelerated to 2x speed](https://res.cloudinary.com/demo/video/upload/e_accelerate:100/docs/long-boarding-one-surfer.mp4 "thumb: h_150")

### adv_redeye
&nbsp;`e_adv_redeye`

Requires the [Advanced Facial Attribute Detection add-on](./advanced_facial_attributes_detection_addon).Automatically removes red eyes from an image.

#### Example
Apply red eye removal to this picture (`e_adv_redeye`):

![Image of eyes with redeye removed](https://res.cloudinary.com/demo/image/upload/e_adv_redeye/docs/redeyeman.jpg "thumb: h_150")

### anti_removal
&nbsp;`e_anti_removal[:<distortion level>]`

A [qualifier](#parameter_types) that slightly distorts the corresponding image overlay to prevent easy removal.

**Use with**: [l_\<image id\>](#l_image_id) | [l_fetch](#l_fetch) | [l_text](#l_text) | [u_\<image id\>](#u_image_id) | [u_fetch](#u_fetch)

**Learn more**: [Smart anti-removal](./layers#smart_anti_removal)

#### Syntax details
| Value            | Type    | Description                                                        |
| ---------------- | ------- | ------------------------------------------------------------------ |
| distortion level | integer | The level of distortion. **Range**: `1 to 100`. **Default**: `50`. |

#### Example
Add an overlay with a distortion level of 95 (`e_anti_removal:95`):

![Image delivered with overlay distorted at a level of 95](https://res.cloudinary.com/demo/image/upload/l_cloudinary_icon/e_anti_removal:95,fl_layer_apply,g_north_west/horses.jpg "thumb: h_150")

### art
&nbsp;`e_art:<filter>`

Applies the selected artistic filter.

**Learn more**: [Artistic filter effects](./effects_and_artistic_enhancements#artistic_filter_effects)

#### Syntax details
| Value  | Type     | Description                                                                                                                                                                                                                                                                                        |
| ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| filter | constant | **Required.** The artistic filter to apply. **Possible values**: `al_dente`, `athena`, `audrey`, `aurora`, `daguerre`, `eucalyptus`, `fes`, `frost`, `hairspray`, `hokusai`, `incognito`, `linen`, `peacock`, `primavera`, `quartz`, `red_rock`, `refresh`, `sizzle`, `sonnet`, `ukulele`, `zorro` |

#### Example
Apply the `incognito` artistic filter (`e_art:incognito`):

![Image delivered with automatic brightness adjusted to an amount of 70](https://res.cloudinary.com/demo/image/upload/e_art:incognito/horses.jpg "thumb: h_150")

### auto_brightness
&nbsp;`e_auto_brightness[:<blend percentage>]`

Automatically adjusts the image brightness and blends the result with the original image.

#### Syntax details
| Value            | Type    | Description                                                                                                                                                 |
| ---------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| blend percentage | integer | The blend percentage, where 0 means only use the original and 100 means only use the adjusted brightness result. **Range**: `0 to 100`. **Default**: `100`. |

#### Example
Automatically adjust the brightness and apply an 80% blend (`e_auto_brightness:80`):

![Image delivered with automatic brightness adjusted to an amount of 70](https://res.cloudinary.com/demo/image/upload/e_auto_brightness:80/horses.jpg "thumb: h_150")

### auto_color
&nbsp;`e_auto_color[:<blend percentage>]`

Automatically adjusts the image color balance and blends the result with the original image.

#### Syntax details
| Value            | Type    | Description                                                                                                                                            |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| blend percentage | integer | The blend percentage, where 0 means only use the original and 100 means only use the adjusted color result. **Range**: `0 to 100`. **Default**: `100`. |

#### Example
Automatically adjust the color and apply an 80% blend (`e_auto_color:80`):

![Image delivered with automatic color adjusted to an amount of 80](https://res.cloudinary.com/demo/image/upload/e_auto_color:80/horses.jpg "thumb: h_150")

### auto_contrast
&nbsp;`e_auto_contrast[:<blend percentage>]`

Automatically adjusts the image contrast and blends the result with the original image.

#### Syntax details
| Value            | Type    | Description                                                                                                                                               |
| ---------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| blend percentage | integer | The blend percentage, where 0 means only use the original and 100 means only use the adjusted contrast result. **Range**: `0 to 100`. **Default**: `100`. |

#### Example
Automatically adjust the contrast and apply an 80% blend (`e_auto_contrast:80`):

![Image delivered with automatic contrast adjusted to an amount of 80](https://res.cloudinary.com/demo/image/upload/e_auto_contrast:80/horses.jpg "thumb: h_150")

### auto_enhance
&nbsp;`e_auto_enhance[:enhance-colors_<enhance colors>]`

Uses AI to automatically enhance an image by optimizing its quality based on the detected quality. If the image is already high quality, only minor adjustments are made. Otherwise, more aggressive enhancements are applied to improve the overall appearance, including noise reduction and detail enhancement.

{tip:title=Best practices}

* If you know your images suffer from color degradation, set the `enhance-colors` flag to `true` for improved color enhancement.

{/tip}
{note:title=Notes and limitations:}

* There is a [special transformation count](./transformation_counts#special_effect_calculations) for the auto enhance effect.
* The auto enhance effect is not supported for [fetched](./fetch_remote_images#fetch_and_deliver_remote_files) images.

{/note}
**Learn more**: [Image enhancement options](./effects_and_artistic_enhancements#image_enhancement_options)

#### Syntax details
| Value          | Type    | Description                                                                                                                                                                                                     |
| -------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enhance colors | boolean | Whether to apply color enhancement in addition to other enhancements. **Possible values**: `true` or `false`. **Default**: `false` **Note**: Set to `true` only if you know your images have color degradation. |

#### Examples
1. Automatically enhance an image using default settings (`e_auto_enhance`):

    ![Image delivered with automatic enhancement](https://res.cloudinary.com/demo/image/upload/e_auto_enhance/horses.jpg "thumb: h_150")

2. Automatically enhance an image with color enhancement enabled (`e_auto_enhance:enhance-colors_true`):

    ![Image delivered with automatic enhancement and color correction](https://res.cloudinary.com/demo/image/upload/e_auto_enhance:enhance-colors_true/horses.jpg "thumb: h_150")

### assist_colorblind
&nbsp;`e_assist_colorblind[:<assist type>]`

Applies stripes or color adjustment to help people with common color blind conditions to differentiate between colors that are similar for them.

**Learn more**: [Blog post](https://cloudinary.com/blog/open_your_eyes_to_color_accessibility)

#### Syntax details
| Value       | Type                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| assist type | integer &#124; constant | The type of transformation to apply to an image. Specify either:The stripe strength as an integer representing the intensity of vertical and horizontal stripes used to help differentiate problematic colors. Lower strength values indicate more subtle stripes. **Range**: `1 to 100`.**xray**: Replaces problematic colors with colors that are easier to differentiate.**Default**: Stripes with a strength value of 10. |

#### Examples
1. Add vertical and horizontal stripes to problematic colors using a stripe strength of 20 (`e_assist_colorblind:20`):
![Stripes added to red and green image](https://res.cloudinary.com/demo/image/upload/e_assist_colorblind:20/docs/colorblind_green_red.jpg "thumb: h_150")
1. Convert the red and green colors of the original image to ones that are easier to differentiate (`e_assist_colorblind:xray`):
![Red and green colors changed to purple and yellow](https://res.cloudinary.com/demo/image/upload/e_assist_colorblind:xray/docs/colorblind_green_red.jpg "thumb: h_150")

### background_removal
&nbsp;`e_background_removal[:fineedges_<enable fine edges>]`

Makes the background of an image transparent.

{tip:title=Notes and tips}

**Notes:**
* There is a [special transformation count](./transformation_counts#special_effect_calculations) for the background removal effect.
* When Cloudinary is generating a derived version, you may get a 423 response returned until the version is ready. You can prepare derived versions in advance using an [eager transformation](./eager_and_incoming_transformations#eager_transformations).
* When Cloudinary is generating an [incoming transformation](./eager_and_incoming_transformations#incoming_transformations), you may get a 420 response returned, with status `pending` until the asset is ready.
* The background removal transformation imposes a limit of 6144 x 6144 pixels on its input images. If an image exceeds this limit, the transformation first scales down the image to fit the limit, and then processes it. The scaling doesn't affect the aspect ratio of the image, but it does alter its output dimensions.
* Background removal on the fly isn't supported for [fetched](./fetch_remote_images#fetch_and_deliver_remote_files) images.

**Tips:**

* This transformation generally gives better results than the [e_bgremoval](#e_bgremoval) and [e_make_transparent](#e_make_transparent) effects.
* It works well for foreground objects with fine edges and lets you specify certain items that you expect to see as foreground objects.
* You can also try the [Pixelz Remove the Background add-on](./remove_the_background_image_editing_addon) for professional manual background removal.

{/tip}

**Learn more**: [Background removal](./background_removal)

#### Syntax details
| Value             | Type     | Description                                                                                                                                                                                  |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enable fine edges | constant | Enables detailed background removal around a foreground object with fine detail around its edges. Possible values: `y`: enable fine edges functionality`n`: disable fine edges functionality |

#### Examples
1. Remove the background of an image (`e_background_removal`):
![Female model with background removed](https://res.cloudinary.com/demo/image/upload/e_background_removal/docs/casual_yellow.png "thumb: h_150")

1. Remove the background of an image, where the foreground object has fine edges (`e_background_removal:fineedges_y`):
![Furry paw](https://res.cloudinary.com/demo/image/upload/e_background_removal:fineedges_y/docs/paw.png "thumb: h_150")

### bgremoval
&nbsp;`e_bgremoval[:screen][:<color to remove>]`

Makes the background of an image transparent (or solid white for JPGs). Use when the background is a uniform color. 

{tip:title=Tips}

* If the background is not uniform, you can also try the [e_make_transparent](#e_make_transparent) effect. 
* If neither `e_bgremoval` nor `e_make_transparent` give the desired result, it's recommended to try the [e_background_removal](#e_background_removal) effect. 
* You can also try the [Pixelz Remove the Background add-on](./remove_the_background_image_editing_addon) for professional manual background removal.
{/tip}

#### Syntax details
| Value           | Type    | Description                                                                                                                                                              |
| --------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| screen          | keyword | If `screen` is specified, provides better results for images with near perfect green/blue background.                                                                    |
| color to remove | string  | The background color as an RGB/A hex code. Overrides the algorithm's choice of background color.**Default**: The algorithm's choice - often the edge color of the image. |

#### Examples
1. Remove the background of an image (`e_bgremoval`):
![Female model with background removed](https://res.cloudinary.com/demo/image/upload/e_bgremoval/docs/casual_yellow.png "thumb: h_150")

1. Remove the background of an image, specifying the yellow background to be removed, rather than the red border that the algorithm would otherwise choose (`e_bgremoval:rgb:ffff00`):
![Female model with yellow background removed, retaining red border](https://res.cloudinary.com/demo/image/upload/e_bgremoval:rgb:ffff00/docs/casual_yellow_red_border.png "thumb: h_150")

1. Remove the green-screen background of an image (`e_bgremoval:screen`):
![Female model with yellow background removed, retaining red border](https://res.cloudinary.com/demo/image/upload/e_bgremoval:screen/docs/casual_green.png "thumb: h_150")

### blackwhite
&nbsp;`e_blackwhite[:<threshold>]`

Converts an image to black and white.

{note}
You can also convert an image to [grayscale](#e_grayscale).
{/note}

#### Syntax details
| Value     | Type    | Description                                                                                  |
| --------- | ------- | -------------------------------------------------------------------------------------------- |
| threshold | integer | The balance between black (`100`) and white (`0`). **Range**: `0 to 100`. **Default**: `50`. |

#### Examples
1. Convert an image to black and white (`e_blackwhite`):
![Black and white image](https://res.cloudinary.com/demo/image/upload/e_blackwhite/horses.jpg "thumb: h_150")

1. Convert an image to black and white with a stronger preference for white (`e_blackwhite:40`):
![Black and white image with stronger preference for white](https://res.cloudinary.com/demo/image/upload/e_blackwhite:40/horses.jpg "thumb: h_150")

### blue
&nbsp;`e_blue:<level>`

Adjust an image's blue channel.

#### Syntax details
| Value | Type    | Description                                                    |
| ----- | ------- | -------------------------------------------------------------- |
| level | integer | The level of blue. **Range**: `-100 to 100`. **Default**: `0`. |

#### Example
Adjust an image's blue channel to 90 (`e_blue:90`):

![Blue channel adjusted in image to 90](https://res.cloudinary.com/demo/image/upload/e_blue:90/horses.jpg "thumb: h_150")

### blur
&nbsp;`e_blur[:<strength>]`

Applies a blurring filter to an asset.

#### Syntax details
| Value    | Type    | Description                                                           |
| -------- | ------- | --------------------------------------------------------------------- |
| strength | integer | The strength of the blur. **Range**: `1 to 2000`. **Default**: `100`. |

#### Example
Apply a blurring filter to a video with a strength of 800 (`e_blur:800`):

![Blurred sunset video](https://res.cloudinary.com/demo/video/upload/e_blur:800/docs/sunset_waves.mp4 "thumb: h_150")

### blur_faces
&nbsp;`e_blur_faces[:<strength>]`

Blurs all detected faces in an image.

#### Syntax details
| Value    | Type    | Description                                                           |
| -------- | ------- | --------------------------------------------------------------------- |
| strength | integer | The strength of the blur. **Range**: `1 to 2000`. **Default**: `500`. |

#### Example
Blur all detected faces in an image with a strength of 800 (`e_blur_faces:800`):

![People with blurred faces](https://res.cloudinary.com/demo/image/upload/e_blur_faces:800/couple.jpg "thumb: h_150")

### blur_region
&nbsp;`e_blur_region[:<strength>]`

Applies a blurring filter to the region of an image specified by x, y, width and height, or an area of text.  If no region is specified, the whole image is blurred.

#### Optional qualifiers
[x, y (x & y coordinates)](#x_y_coordinates) | [w (width)](#w_width) | [h (height)](#h_height) | [g_ocr_text](#g_special_position)

#### Syntax details
| Value    | Type    | Description                                                           |
| -------- | ------- | --------------------------------------------------------------------- |
| strength | integer | The strength of the blur. **Range**: `1 to 2000`. **Default**: `100`. |

#### Examples
1. Apply a blurring filter of strength 1000, to the region of an image specified by a rectangle of width 550 pixels, height 425 pixels, starting at coordinates (600,400) (`e_blur_region:1000,h_425,w_550,x_600,y_400`):
![Part of horse picture blurred](https://res.cloudinary.com/demo/image/upload/e_blur_region:1000,h_425,w_550,x_600,y_400/horses.jpg "thumb: h_150")

2. Apply a blurring filter of strength 1500, to the bottom quarter of an image (`e_blur_region:1500,y_0.75`):
![Bottom quarter of horse picture blurred](https://res.cloudinary.com/demo/image/upload/e_blur_region:1500,y_0.75/horses.jpg "thumb: h_150")

3. Blur a car number plate, using a blur strength of 1500 together with the [OCR Text Detection](./ocr_text_detection_and_extraction_addon) add-on  (`e_blur_region:1500,g_ocr_text`):
![Car with blurred number plate](https://res.cloudinary.com/demo/image/upload/e_blur_region:1500,g_ocr_text/black_car.jpg "thumb: h_150")

### boomerang
&nbsp;`e_boomerang`

Causes a video clip to play forwards and then backwards.

Use in conjunction with trimming parameters ([duration](#du_duration), [start_offset](#so_start_offset), or [end_offset](#eo_end_offset) and the [loop](#e_loop) effect to deliver a classic (short, repeating) boomerang clip.

**Learn more**: [Create a boomerang video clip](./video_effects_and_enhancements#boomerang)

#### Example
Deliver the 2 seconds of a video between seconds 3 and 5 and then append a boomeranged (reversed) version of that same clip as an animated GIF that loops infinitely:
![looping gif boomerang with offset](https://res.cloudinary.com/demo/video/upload/eo_5.0,so_3.0/e_boomerang/e_loop/snow_deer.gif "thumb:ac_none,h_150")

### brightness
&nbsp;`e_brightness:<level>`

Adjusts the image or video brightness.

#### Syntax details
| Value | Type    | Description                                                                                                         |
| ----- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| level | integer | The level of brightness. The lower the number the lower the brightness. **Range**: `-99 to 100`. **Default**: `80`. |

#### Example
Adjust an image brightness to 60 (`e_brightness:60`):

![Image delivered with brightness 60](https://res.cloudinary.com/demo/image/upload/e_brightness:60/horses.jpg "thumb: h_150")

### brightness_hsb
&nbsp;`e_brightness_hsb[:<level>]`

Adjusts image brightness modulation in HSB to prevent artifacts in some images.

#### Syntax details
| Value | Type    | Description                                                          |
| ----- | ------- | -------------------------------------------------------------------- |
| level | integer | The level of modulation. **Range**: `-99 to 100`. **Default**: `80`. |

#### Example
Adjust an image brightness in HSB modulation to -50 (`e_brightness_hsb:-50`):

![Image delivered with HSB brightness -50](https://res.cloudinary.com/demo/image/upload/e_brightness_hsb:-50/horses.jpg "thumb: h_150")

### camera
&nbsp;`e_camera[[:up_<vertical position>][;right_<horizontal position>][;zoom_<zoom amount>][;env_<environment>][;exposure_<exposure amount>][;frames_<number of frames>]]`

A [qualifier](#parameter_types) that lets you customize a 2D image captured from a 3D model, as if a photo is being taken by a camera.

The camera always points towards the center of the 3D model and can be rotated around it. Specify the position of the camera, the exposure, zoom and lighting to capture your perfect shot. 

Use with [fl_animated](#fl_animated) to create a 360 spinning animation. 

**Use with**: [f (format)](./transformation_reference#f_supported_format)

**Learn more**: [Generating an image from a 3D model](./transformations_on_3d_models#generating_an_image_from_a_3d_model)

**See also**: [e_light](#e_light)

#### Syntax details
| Value               | Type               | Description                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| vertical position   | integer            | The vertical position of the camera in degrees. **Range for still images**: `-360` to `360`. **Default**: `0`.**Range for 360 animations**: `-80` to `80`. **Default**: `0`.                                                                                                                                                       |
| horizontal position | integer            | The horizontal position of the camera in degrees (or the start position for 360 animations). **Range**: `-360` to `360`. **Default**: `0`.                                                                                                                                                                                         |
| zoom amount         | float (percentage) | The amount of zoom to apply to the 3D model. Specify as a float value corresponding to a percentage. Values less than 1.0 move the camera back (zoom out). Values greater than 1.0 move the camera forward (zoom in). **Range**: `0.2` to `5.0`. **Default**: `1.0` (auto find where the object is included with a bit of margin). |
| environment         | string             | The type of lighting to use. **Possible values**: `neutral`, `spruit_sunrise`, `whipple_creek`, `music_hall`, `pillars`, `aircraft_workshop`, and `none`.**Default**: `neutral`.                                                                                                                                                   |
| exposure amount     | float              | The amount of exposure to apply. **Range**: `0.0` to `2.0`. **Default**: `1.0`.                                                                                                                                                                                                                                                    |
| number of frames    | integer            | Relevant for 360 animations. The number of frames to capture for the animation. **Range**: `2` to `36`. **Default**: `24`.                                                                                                                                                                                                         |

#### Examples
1. Capture a JPG image of the `cute-kitty` 3D model (`f_jpg`) with the camera positioned at an angle of 45 degrees above the cat (`up_45`), rotated 60 degrees to the left (`right_-60`), zoomed in to 120% (`zoom_1.2`), with "whipple_creek" lighting (`env_whipple_creek`) and 1.8 amount of exposure (`exposure_1.8`): 
   ![Image of cute kitty model from a particular angle](https://res.cloudinary.com/demo/image/upload/e_camera:up_45;right_-60;zoom_1.2;env_whipple_creek;exposure_1.8/f_jpg/docs/cute-kitty "thumb: h_150")
1. Capture a PNG image of the `cute-kitty` 3D model (`f_png`) with the camera positioned at an angle of 20 degrees below the cat (`up_-20`) and rotated 45 degrees to the right (`right_45`): 
   ![Image of cute kitty model from a particular angle](https://res.cloudinary.com/demo/image/upload/e_camera:up_20;right_45/f_png/docs/cute-kitty "thumb: h_150")
1. Create a 360 animation of the `cute-kitty` 3D model (`fl_animated,f_webp`) with the camera positioned 60 degrees up and starting at 45 degrees to the right, capturing 36 frames (`e_camera:up_60;right_45;frames_36`):
   ![360 animation of cute kitty model](https://res.cloudinary.com/demo/image/upload/e_camera:up_60;right_45;frames_36/fl_animated,f_webp/docs/cute-kitty "thumb: h_150")
   
      "Cute Little Kitty" [https://skfb.ly/ospAT](https://skfb.ly/ospAT) by Diskette96 is licensed under [Creative Commons Attribution](http://creativecommons.org/licenses/by/4.0/).

### cartoonify
&nbsp;`e_cartoonify[:<line strength>][:<color reduction>]`

Applies a cartoon effect to an image.

#### Syntax details
| Value           | Type                    | Description                                                                                                                                                                                                                                                                                         |
| --------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| line strength   | integer                 | The thickness of the lines. **Range**: `0 to 100`. **Default**: `50`.                                                                                                                                                                                                                               |
| color reduction | integer &#124; constant | The decrease in the number of colors and corresponding saturation boost of the remaining colors. Higher reduction values result in a less realistic look.Set to `bw` for a black and white cartoon effect.**Range**: `0 to 100`. **Default**: Adjusts automatically according to the line strength. |

#### Examples
1. Generate a cartoonified version of an image with thick lines, high saturation and unrealistic colors (`e_cartoonify:70:80`):
![Image of horses cartoonified](https://res.cloudinary.com/demo/image/upload/e_cartoonify:70:80/horses.jpg "thumb: h_150")

2. Generate a black and white cartoonified version of an image with thin lines (`e_cartoonify:20:bw`):
![Black and white image of horses cartoonified](https://res.cloudinary.com/demo/image/upload/e_cartoonify:20:bw/horses.jpg "thumb: h_150")

### colorize
{actionType:type=image}&nbsp;`e_colorize[:<level>]`

Colorizes an image. By default, gray is used for colorization. You can specify a different color using the color [qualifier](#parameter_types).

#### Optional qualifier
[color](#co_color)

#### Syntax details
| Value | Type    | Description                                                           |
| ----- | ------- | --------------------------------------------------------------------- |
| level | integer | The strength of the color. **Range**: `0 to 100`. **Default**: `100`. |

#### Examples
{collapsed}

1. Colorize an image in gray with a strength of 80 (`e_colorize:80`):
![Image colorized in gray](https://res.cloudinary.com/demo/image/upload/e_colorize:80/horses.jpg "thumb: h_150")

2. Colorize an image in dark violet with a strength of 35 (`co_darkviolet,e_colorize:35`):
![Image colorized in dark violet](https://res.cloudinary.com/demo/image/upload/co_darkviolet,e_colorize:35/horses.jpg "thumb: h_150")

{/collapsed}

{/actionType}

### contrast
&nbsp;`e_contrast[:level_<level>][;type_<function type>]`

Adjusts an image or video contrast.

{note}This transformation also supports [non-verbose, ordered](./image_transformations#verbose_vs_non_verbose_syntax) syntax.{/note}

#### Syntax details
| Value         | Type    | Description                                                                                                                                                                                                 |
| ------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| level         | integer | The level of contrast. The lower the number the lower the contrast. **Range (sigmoidal)**: `-100 to  100`. **Default**: `0`.**Range (linear)**: `1 to 200`. **Default**: `100`.                             |
| function type | string  | The function to use for the contrast effect. **Possible values**: `sigmoidal`: Uses a sigmoidal function.`linear`: Uses a linear function that is the equivalent of CSS contrast. **Default**: `sigmoidal`. |

#### Examples
1. Adjust an image contrast to -70 using the default sigmoidal function (`e_contrast:level_-70`):
![Image delivered with sigmoidal contrast -70](https://res.cloudinary.com/demo/image/upload/e_contrast:level_-70/horses.jpg "thumb: h_150")
1. Adjust an image contrast to 150 using the linear function (`e_contrast:level_150;type_linear`):
![Image delivered with linear contrast 150](https://res.cloudinary.com/demo/image/upload/e_contrast:level_150;type_linear/horses.jpg "thumb: h_150")

### cut_out
&nbsp;`e_cut_out`

Trims pixels according to the transparency levels of a specified overlay image. Wherever an overlay image is transparent, the original is shown, and wherever an overlay is opaque, the resulting image is transparent.

This effect applies only when the base asset is an image, not a video.
{note}
The same [layer transformation syntax](./layers#layer_transformation_syntax) rules apply, including for [authenticated or private assets](./layers#authenticated_or_private_layers).
{/note}
#### Required qualifiers
[l (layer)](#l_layer)

**Learn more**: [Shape cutouts: remove a shape](./effects_and_artistic_enhancements#remove_a_shape) 

#### Example
Cut an overlay image (`docs/logo/logo`) out of a base ruler image (`e_cut_out,l_docs:logo:logo`).  The size and position of the overlay are controlled by the crop, gravity, width, x and y parameters (`c_scale,g_south_west,w_200,x_20,y_20`): 
![Image of a ruler with the Cloudinary logo cut out](https://res.cloudinary.com/demo/image/upload/c_scale,e_cut_out,g_south_west,l_docs:logo:logo,w_200,x_20,y_20/v1/docs/10cm_ruler.png "thumb: h_150")

### deshake
&nbsp;`e_deshake[:<pixels>]`

Removes small motion shifts from a video. Useful for non-professional (user-generated content) videos.

#### Syntax details
| Value  | Type     | Description                                                                                                                                               |
| ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pixels | constant | The maximum number of pixels in the horizontal and vertical direction that are addressed. **Possible values**: `16`, `32`, `48`, `64`. **Default**: `16`. |

#### Example
Apply the deshake effect to a home video with a default motion shift of up to 16 pixels (`e_deshake:32`): 
![Home video with deshake effect applied](https://res.cloudinary.com/demo/video/upload/e_deshake/race_finish_line.mp4 "thumb: ac_none,h_150")

### displace
&nbsp;`e_displace`

Displaces the pixels in an image according to the color channels of the pixels in another specified image (a gradient map specified with the overlay parameter).
{note}
The same [layer transformation syntax](./layers#layer_transformation_syntax) rules apply, including for [authenticated or private assets](./layers#authenticated_or_private_layers).
{/note}
#### Required qualifiers
At least one of the following: [x, y (x & y coordinates)](#x_y_coordinates)
{note}
Values of `x` and `y` must be between -999 and 999.
{/note}
**Learn more**: [Displacement maps](./effects_and_artistic_enhancements#displacement_maps)

#### Example
Displace an image using the `radialize` gradient map (`l_radialize/e_displace,fl_layer_apply,y_100`): 
![Displaced horse image](https://res.cloudinary.com/demo/image/upload/l_radialize/e_displace,fl_layer_apply,y_100/horses.jpg "thumb: h_150")

### distort
Distorts an image to a new shape by either adjusting its [corners](#e_distort_corners) or by warping it into an [arc](#e_distort_arc).

&nbsp;`e_distort:<x1>:<y1>:<x2>:<y2>:<x3>:<y3>:<x4>:<y4>`

Distorts an image, or text overlay, to a new shape by adjusting its corners to achieve perception warping.

**Learn more**: [Image shape changes and distortion effects](./effects_and_artistic_enhancements#distort)

#### Syntax details
| Value  | Type                 | Description                                                                |
| ------ | -------------------- | -------------------------------------------------------------------------- |
| x1, y1 | integer &#124; float | **Required.** The new coordinates of the top left corner of the image.     |
| x2, y2 | integer &#124; float | **Required.** The new coordinates of the top right corner of the image.    |
| x3, y3 | integer &#124; float | **Required.** The new coordinates of the bottom right corner of the image. |
| x4, y4 | integer &#124; float | **Required.** The new coordinates of the bottom left corner of the image.  |

#### Example
Distort an image to a new shape (`e_distort:150:340:1500:10:1500:1550:50:1000`): 
![Distorted image of horses](https://res.cloudinary.com/demo/image/upload/e_distort:150:340:1500:10:1500:1550:50:1000/horses.jpg "thumb: h_150")

&nbsp;`e_distort:arc:<degrees>`

Distorts an image, or text overlay, to an arc shape.

**Learn more**: [Image shape changes and distortion effects](./effects_and_artistic_enhancements#distort)

#### Syntax details
| Value   | Type                 | Description                                                                                                                                                                                     |
| ------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| degrees | integer &#124; float | **Required.** The angle of distortion. Positive values curve the image upwards (like a frown). Negative values curve the image downwards (like a smile).**Range**: `-360 to -1` and `1 to 360`. |

#### Example
Distort an arrow image into a 180&deg; upwards curve (`e_distort:arc:180.0`): 
![Curved one way sign](https://res.cloudinary.com/demo/image/upload/e_distort:arc:180.0/one_way_sign.png "thumb: h_150")

### dropshadow
&nbsp;`e_dropshadow[:azimuth_<azimuth>][;elevation_<elevation>][;spread_<spread>]`

Adds a shadow to the object(s) in an image. Specify the angle and spread of the light source causing the shadow.
{notes}

* Either:
  * the original image must include transparency, for example where the background has already been removed  and it has been stored in a format that supports transparency, such as PNG, or
  * the `dropshadow` effect must be chained after the [background_removal](./transformation_reference#e_background_removal) effect, for example: 
  
![Lipstick with background removed and shadow added](https://res.cloudinary.com/demo/image/upload/e_background_removal/e_dropshadow/docs/lipstick "with_image:false") 

* The dropshadow effect is not supported for [animated](./animated_images) images, [fetched](./fetch_remote_images#fetch_and_deliver_remote_files) images or [incoming transformations](./eager_and_incoming_transformations#incoming_transformations).
  
{/notes}
**Learn more**: [Dropshadow effect](./effects_and_artistic_enhancements#dropshadow_effect)

**See also**: [e_shadow](#e_shadow)

#### Syntax details
| Value     | Type    | Description                                                                                                                                                                                                                                                    |
| --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| azimuth   | integer | The direction the light is coming from to cause the shadow effect. A value of 0 / 360 (north) means that the light is coming from behind the object and the shadow will be dropped towards the front of the object. **Range**: `0 to 360`. **Default**: `215`. |
| elevation | integer | The height of the light source above the 'ground' to cause the shadow effect.**Range**: `0 to 90`. **Default**: `45`.                                                                                                                                          |
| spread    | integer | The spread of the light source. A small number means 'point' light. A larger number means 'area' light.**Range**: `0 to 100`. **Default**: `50`.                                                                                                               |

#### Example
Add a shadow to the lipstick, with the light source coming from an azimuth of 220 degrees, and an elevation of 40 degrees, with a spread of 20% (`e_dropshadow:azimuth_220;elevation_40;spread_20`): 
![Shadow added to image of lipstick](https://res.cloudinary.com/demo/image/upload/e_dropshadow:azimuth_220;elevation_40;spread_20/docs/rmv_bgd/lipstick-png "thumb: h_150")

### enhance
&nbsp;`e_enhance`

Uses AI to analyze an image and make adjustments to enhance the appeal of the image, such as: 

* **Exposure reduction**: Correcting overexposed images, smartly reducing excessive brightness and reclaiming details in bright areas, bringing back a balanced exposure.
* **Exposure enhancement**: Adjusting underexposed images by enhancing dim areas, thus improving overall exposure without compromising the image's natural quality.
* **Color intensification**: Enriching color vividness, making hues more vibrant and lively, thus bringing a more dynamic color range to the image.
* **Color temperature correction**: Adjusting the white balance, correcting color casts and ensuring that the colors in the image accurately reflect their real-world appearance.

Consider also using [generative restore](#e_gen_restore) to revitalize poor quality images, or the [improve](#e_improve) effect to automatically adjust color, contrast and brightness. See this [comparison of image enhancement options](./effects_and_artistic_enhancements#image_enhancement_options).
{note:title=Notes and limitations:}

* During processing, large images are downscaled to a maximum of 4096 x 4096 pixels, then upscaled back to their original size, which may affect quality.
* There is a [special transformation count](./transformation_counts#special_effect_calculations) for the enhance effect.
* The enhance effect is not supported for [fetched](./fetch_remote_images#fetch_and_deliver_remote_files) images.
* If you're using our [Asia Pacific data center](./admin_api#alternative_data_centers_and_endpoints_premium_feature), you currently can't apply the enhance effect. 

{/note}
**See also**: [e_improve](#e_improve) | [e_gen_restore](#e_gen_restore)

#### Example
Enhance this underexposed image (`e_enhance`): 
![Woman in the dark with improved exposure](https://res.cloudinary.com/demo/image/upload/e_enhance/docs/under-exposed.jpg "thumb:c_scale,w_150")

### extract
&nbsp;`e_extract:prompt_(<prompt 1>[;...;<prompt n>])[;multiple_<detect multiple>][;mode_<mode>][;invert_<invert>][;preserve-alpha_<preserve alpha>]`

Extracts an area or multiple areas of an image, described in natural language. You can choose to keep the content of the extracted area(s) and make the rest of the image transparent (like background removal), or make the extracted area(s) transparent, keeping the content of the rest of the image. Alternatively, you can make a grayscale mask of the extracted area(s) or everything excluding the extracted area(s), which you can use with other transformations such as [e_mask](#e_mask), [e_multiply](#e_multiply), [e_overlay](#e_overlay) and [e_screen](#e_screen).
{note:title=Notes and limitations:}

* During processing, large images are downscaled to a maximum of 2048 x 2048 pixels, then upscaled back to their original size, which may affect quality.
* This transformation changes the image's visual appearance by adjusting only the alpha channel, which controls transparency. The underlying RGB channel data remains unchanged and fully preserved, even in areas that become fully transparent.
* When you specify more than one prompt, all the objects specified in each of the prompts will be extracted whether or not `multiple_true` is specified in the URL.
* There is a [special transformation count](./transformation_counts#special_effect_calculations) for the extract effect.
* The extract effect is not supported for [animated](./animated_images) images, [fetched](./fetch_remote_images#fetch_and_deliver_remote_files) images or [incoming transformations](./eager_and_incoming_transformations#incoming_transformations).
* [User-defined variables](./user_defined_variables) cannot be used for the prompt when more than one prompt is specified.
* When Cloudinary is generating a derived version, you may get a 423 response returned until the version is ready. You can prepare derived versions in advance using an [eager transformation](./eager_and_incoming_transformations#eager_transformations).
* When Cloudinary is generating an [incoming transformation](./eager_and_incoming_transformations#incoming_transformations), you may get a 420 response returned, with status `pending` until the asset is ready.
* If you're using our [Asia Pacific data center](./admin_api#alternative_data_centers_and_endpoints_premium_feature), you currently can't apply the extract effect. 

{/note}
**See also**: [e_background_removal](#e_background_removal)

**Learn more**: [Shape cutouts: use AI to determine what to remove or keep in an image](./effects_and_artistic_enhancements#use_ai_to_determine_what_to_remove_or_keep_in_an_image)

#### Syntax details
| Value                | Type     | Description                                                                                                                                                                                                       |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prompt 1 to prompt n | string   | **Required.** Natural language descriptions of the areas of the image to extract.                                                                                                                                 |
| detect multiple      | constant | Whether to detect multiple instances of the prompt. **Possible values**: `true`, `false`. **Default**: `false`.                                                                                                   |
| mode                 | constant | Whether to keep the content of the extracted area, or to replace it with a mask  **Possible values**: `content`, `mask`. **Default**: `content`.                                                                  |
| invert               | constant | If true, in `content` mode, keep all the content except the extracted area, in `mask` mode, make the mask cover everything except the extracted area. **Possible values**: `true`, `false`. **Default**: `false`. |
| preserve alpha       | constant | If true, areas that are transparent in the input image remain transparent, even if they're targeted by the `prompt` and `invert` parameters.  **Possible values**: `true`, `false`. **Default**: `false`.         |

#### Examples
1. Extract the woman on the left (`e_extract:prompt_the%20woman%20on%20the%20left`):
    ![Isolated woman on the left](https://res.cloudinary.com/demo/image/upload/e_extract:prompt_the%20woman%20on%20the%20left/docs/ladies-smiling.jpg "thumb: h_150")

2. Extract all the women in the image (`e_extract:prompt_woman;multiple_true`):
   ![Isolate multiple women](https://res.cloudinary.com/demo/image/upload/e_extract:prompt_woman;multiple_true/docs/ladies-smiling.jpg "thumb: h_150")

3. Provide a mask for the woman on the right (`e_extract:prompt_the%20woman%20on%20the%20right;mode_mask`):
    ![Mask of the woman on the right](https://res.cloudinary.com/demo/image/upload/e_extract:prompt_the%20woman%20on%20the%20right;mode_mask/docs/ladies-smiling.jpg "thumb: h_150")

4. Extract the camera, its straps, and the man (`e_extract:prompt_(the%20camera;the%20man;the%20straps%20hanging%20from%20the%20camera)`):
   ![Isolated camera, straps and man](https://res.cloudinary.com/demo/image/upload/e_extract:prompt_(the%20camera;the%20man;the%20straps%20hanging%20from%20the%20camera)/docs/camera.jpg "thumb: h_150")

5. Extract the camera, its straps, and the man and invert the result to keep the rest of the content (`e_extract:prompt_(the%20camera;the%20man);invert_true`):
   ![Isolated camera, straps and man, inverted](https://res.cloudinary.com/demo/image/upload/e_extract:prompt_(the%20camera;the%20man;the%20straps%20hanging%20from%20the%20camera);invert_true/docs/camera.jpg "thumb: h_150")

6. Extract the watch dial and invert the result, leaving just the strap, and preserving the transparency for the background (`e_extract:prompt_the%20watch%20dial;invert_true;preserve-alpha_true/docs/wristwatch.png`):
    ![Watch strap remaining on a transparent background](https://res.cloudinary.com/demo/image/upload/e_extract:prompt_the%20watch%20dial;invert_true;preserve-alpha_true/docs/wristwatch.png "thumb: h_150")

### fade
&nbsp;`e_fade[:<duration>]`

Fades into, or out of, an animated GIF or video. You can chain fade effects to both fade into and out of the media.

**Learn more**: [Fade in and out](./video_effects_and_enhancements#fade_in_out)

#### Syntax details
| Value    | Type    | Description                                                                                                                  |
| -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| duration | integer | The duration of the fade effect in milliseconds.  Positive values fade in and negative values fade out. **Default**: `1000`. |

#### Example
Fade in to the beginning of an animated image over 2000 milliseconds (`e_fade:2000`): 
![Kitten with fade in](https://res.cloudinary.com/demo/image/upload/e_fade:2000/kitten_fighting.gif "thumb: h_150")

### fill_light
&nbsp;`e_fill_light[:<blend>][:<bias>]`

Adjusts the fill light and optionally blends the result with the original image.

#### Syntax details
| Value | Type    | Description                                                                                                                                                  |
| ----- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| blend | integer | How much to blend the effect (0 means use only the original, 100 means use only the adjusted fill light result).  **Range**: `0 to 100`. **Default**: `100`. |
| bias  | integer | The bias to apply to the fill light effect.**Range**: `-100 to 100`. **Default**: `0`.                                                                       |
 
#### Example
Automatically adjust the fill light to an amount of 70, with a bias of 20 (`e_fill_light:70:20`): 
![Horse image with fill light effect](https://res.cloudinary.com/demo/image/upload/e_fill_light:70:20/horses.jpg "thumb: h_150")

### gamma
&nbsp;`e_gamma[:<level>]`

Adjusts the image or video gamma level.

#### Syntax details
| Value | Type    | Description                                                                                                    |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------- |
| level | integer | The level of gamma. The lower the number the lower the gamma level. **Range**: `-50 to 150`. **Default**: `0`. |

#### Example
Adjust image gamma level to 50 (`e_gamma:50`):

![Image delivered with gamma level 50](https://res.cloudinary.com/demo/image/upload/e_gamma:50/horses.jpg "thumb: h_150")

### gen_background_replace
&nbsp;`e_gen_background_replace[:prompt_<prompt>][;seed_<seed>]`

Replaces the background of an image with an AI-generated background. If no prompt is specified, the background is based on the contents of the image. Otherwise, the background is based on the natural language prompt specified. 

For images with transparency, the generated background replaces the transparent area. For images without transparency, the effect first determines the foreground elements and leaves those areas intact, while replacing the background.

Using different seeds, you can regenerate a background if you're not happy with the result.  You can also use seeds to return a previously generated result, as long as any other preceding transformation parameters are the same.
{note:title=Notes and limitations:}

* The use of generative AI means that results may not be 100% accurate.
* There's a [special transformation count](./transformation_counts#special_effect_calculations) for the generative background replace effect.
* If you get blurred results when using this feature, it's likely that the built-in NSFW (Not Safe For Work) check has detected something inappropriate. You can [contact support](https://support.cloudinary.com/hc/en-us/requests/new) to disable this check if you believe it's too sensitive.
* The generative background replace effect isn't supported for [animated](./animated_images) images or [fetched](./fetch_remote_images#fetch_and_deliver_remote_files) images.
* When Cloudinary is generating a derived version, you may get a 423 response returned until the version is ready. You can prepare derived versions in advance using an [eager transformation](./eager_and_incoming_transformations#eager_transformations).
* When Cloudinary is generating an [incoming transformation](./eager_and_incoming_transformations#incoming_transformations), you may get a 420 response returned, with status `pending` until the asset is ready.
* If you're using our [Asia Pacific data center](./admin_api#alternative_data_centers_and_endpoints_premium_feature), you currently can't apply the generative background replace effect. 

{/note}
**Learn more**: [Generative background replace](./generative_ai_transformations#generative_background_replace)

#### Syntax details
| Value  | Type    | Description                                                                                            |
| ------ | ------- | ------------------------------------------------------------------------------------------------------ |
| prompt | string  | A natural language description of what you want to see in the background.                              |
| seed   | integer | Any number that can be used either to regenerate a result, or to return a previously generated result. |

#### Examples
Example 1: Replace the background of this image of a runner (`e_gen_background_replace`): 
![Background replaced of woman running](https://res.cloudinary.com/demo/image/upload/e_gen_background_replace/docs/runner.jpg "with_image:false")

Original image

Background replaced

Example 2: Replace the background with an empty beach (`e_gen_background_replace:prompt_an%20empty%20beach`):
![Background replaced with an empty beach](https://res.cloudinary.com/demo/image/upload/e_gen_background_replace:prompt_an%20empty%20beach/docs/runner.jpg "thumb:h_150")

Example 3: Replace the background of a transparent image (`e_gen_background_replace`):
![Background replaced](https://res.cloudinary.com/demo/image/upload/e_gen_background_replace/docs/luxury_car.png "thumb:h_150")

Example 4: Use a different seed for the previous example  (`e_gen_background_replace:seed_2`):
![Background replaced](https://res.cloudinary.com/demo/image/upload/e_gen_background_replace:seed_2/docs/luxury_car.png "thumb:h_150")

### gen_recolor
&nbsp;`e_gen_recolor:prompt_(<prompt 1>[;...;<prompt n>]);to-color_<to color>[;apply-to-tier_(<tier 0>[;...;<tier n>])][;multiple_<detect multiple>]`

Uses generative AI to recolor parts of your image, maintaining the relative shading. Specify one or more prompts and the color to change them to. Use the `multiple` parameter to replace the color of all instances of the prompt when one prompt is given. 
{note:title=Notes and limitations:}

* The generative recolor effect can only be used on non-transparent images.
* The use of generative AI means that results may not be 100% accurate.
* The generative recolor effect works best on simple objects that are clearly visible, and not abstract concepts such as "background".
* Very small objects and very large objects may not be detected.
* During processing, large images are downscaled to a maximum of 2048 x 2048 pixels, then upscaled back to their original size, which may affect quality.
* When you specify more than one prompt, all the objects specified in each of the prompts will be recolored whether or not `multiple_true` is specified in the URL.
* There is a [special transformation count](./transformation_counts#special_effect_calculations) for the generative recolor effect.
* The generative recolor effect isn't supported for [animated](./animated_images) images or [fetched](./fetch_remote_images#fetch_and_deliver_remote_files) images.
* [User-defined variables](./user_defined_variables) can't be used for the prompt when more than one prompt is specified.
* When Cloudinary is generating a derived version, you may get a 423 response returned until the version is ready. You can prepare derived versions in advance using an [eager transformation](./eager_and_incoming_transformations#eager_transformations).
* When Cloudinary is generating an [incoming transformation](./eager_and_incoming_transformations#incoming_transformations), you may get a 420 response returned, with status `pending` until the asset is ready.
* If you're using our [Asia Pacific data center](./admin_api#alternative_data_centers_and_endpoints_premium_feature), you currently can't apply the generative recolor effect.

{/note}
{tip}
Consider using [e_replace_color](#e_replace_color) if you want to recolor everything of a particular color in your image, rather than specific elements. 
{/tip}

**Learn more**: [Generative recolor](./generative_ai_transformations#generative_recolor)

**See also**: [e_replace_color](#e_replace_color)

#### Syntax details
| Value                | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prompt 1 to prompt n | string   | **Required.** Natural language descriptions of what you want to replace the color of.                                                                                                                                                                                                                                                                                                                      |
| to color             | string   | **Required.** The target color. You can set it as:A 3-digit RGB hex value (e.g. `FE7`)A 6-digit RGB hex value (e.g. `A3CD10`)A [named HTML color](https://www.w3schools.com/tags/ref_colornames.asp) (e.g. `Blue`). Note that HTML color names may not best represent the color you're aiming for, so check for alternatives such as `SaddleBrown` rather than `Brown`. Values can be upper or lower case. |
| tier 0 to tier n     | integer  | 0-based number representing the color at that position in a list of the most dominant colors in the prompt. For example, if the three most dominant colors in a blanket are red (most dominant), blue and green (least dominant), setting `apply-to-tier_(0;1)` would recolor the red and blue in the blanket.                                                                                             |
| detect multiple      | constant | Replace the color of all instances of the prompt in the image when you give one prompt. When you specify several prompts, this is always set to true whether or not you specify `multiple` in the URL. Possible values: `true`: enable multiple detections`false`: disable multiple detections**Default**: `false`.                                                                                        |

#### Examples
Example 1: Change the color of the woman's sweater to green (`e_gen_recolor:prompt_sweater;to-color_green`): 
![Woman's sweater changed to green](https://res.cloudinary.com/demo/image/upload/e_gen_recolor:prompt_sweater;to-color_green/cld-sample.jpg "with_image:false")

Original image

Green sweater

Example 2: Make the sweater, dog and earring a purple color, represented by the hex sting, `5632a8` (`e_gen_recolor:prompt_(sweater;dog;earring);to-color_5632a8`):
![Sweater, dog and earring changed to purple](https://res.cloudinary.com/demo/image/upload/e_gen_recolor:prompt_(sweater;dog;earring);to-color_5632a8/cld-sample.jpg "thumb:h_150")

Example 3: Recolor all the geese in the image to pink (`e_gen_recolor:prompt_goose;to-color_pink;multiple_true`):
![All geese recolored to pink](https://res.cloudinary.com/demo/image/upload/e_gen_recolor:prompt_goose;to-color_pink;multiple_true/docs/geese.jpg "thumb:h_150")

Example 4: Recolor the third, fourth and fifth most dominant colors in the sweater to green (hex color #58d68d) (`e_gen_recolor:prompt_sweater;to-color_58d68d;apply-to-tier_(2;3;4)`):

![Third, fourth and fifth most dominant colors in the sweater recolored to green](https://res.cloudinary.com/demo/image/upload/e_gen_recolor:prompt_sweater;to-color_58d68d;apply-to-tier_(2;3;4)/docs/multi-sweater.jpg "with_image:false")

Original image

Some dominant colorschanged to green

### gen_remove
&nbsp;`e_gen_remove[:prompt_(<prompt 1>[;...;<prompt n>])][;multiple_<detect multiple>][;remove-shadow_<remove shadow>]][:region_((x_<x coordinate 1>;y_<y coordinate 1>;w_<width 1>;h_<height 1>)[;...;(x_<x coordinate n>;y_<y coordinate n>;w_<width n>;h_<height n>)])]`

Uses generative AI to remove unwanted parts of your image, replacing the area with realistic pixels. Specify either one or more prompts or one or more regions. Use the `multiple` parameter to remove all instances of the prompt when one prompt is given. 

By default, shadows cast by removed objects are not removed.  If you want to remove the shadow, when specifying a prompt you can set the `remove-shadow` parameter to `true`.
{note:title=Notes and limitations:}

* The generative remove effect can only be used on non-transparent images.
* The use of generative AI means that results may not be 100% accurate.
* The generative remove effect works best on simple objects that are clearly visible.
* Very small objects and very large objects may not be detected.
* Don't attempt to remove faces or hands.
* During processing, large images are downscaled to a maximum of 6140 x 6140 pixels, then upscaled back to their original size, which may affect quality.
* When you specify more than one prompt, all the objects specified in each of the prompts will be removed whether or not `multiple_true` is specified in the URL.
* There is a [special transformation count](./transformation_counts#special_effect_calculations) for the generative remove effect.
* If you get blurred results when using this feature, it's likely that the built-in NSFW (Not Safe For Work) check has detected something inappropriate. You can [contact support](https://support.cloudinary.com/hc/en-us/requests/new) to disable this check if you believe it's too sensitive.
* The generative remove effect isn't supported for [animated](./animated_images) images or [fetched](./fetch_remote_images#fetch_and_deliver_remote_files) images.
* [User-defined variables](./user_defined_variables) can't be used for the prompt when more than one prompt is specified.
* When Cloudinary is generating a derived version, you may get a 423 response returned until the version is ready. You can prepare derived versions in advance using an [eager transformation](./eager_and_incoming_transformations#eager_transformations).
* When Cloudinary is generating an [incoming transformation](./eager_and_incoming_transformations#incoming_transformations), you may get a 420 response returned, with status `pending` until the asset is ready.
* If you're using our [Asia Pacific data center](./admin_api#alternative_data_centers_and_endpoints_premium_feature), you currently can't apply the generative remove effect.

{/note}
**Learn more**: [Generative remove](./generative_ai_transformations#generative_remove)

#### Syntax details
| Value                | Type     | Description                                                                                                                                                                                                                                                                                                 |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prompt 1 to prompt n | string   | Natural language descriptions of what you want to remove from the image. You can use `text` as a special keyword for the prompt:To remove all text from an image, specify `text`.To remove all text in a particular object, specify `text:<object>`, for example `text:hat`, to remove all text on the hat. |
| detect multiple      | constant | Remove all instances of the prompt in the image when one prompt is given. When several prompts are specified, this is always set to true whether or not `multiple` is specified in the URL. Possible values: `true`: enable multiple detections`false`: disable multiple detections**Default**: `false`.    |
| remove shadow        | constant | Remove the shadow in addition to the object(s) specified in the prompt. Possible values: `true`: remove the shadow`false`: keep the shadow**Default**: `false`.                                                                                                                                             |
| x coordinate 1 to n  | integer  | The x coordinate of the top left pixel of each of the regions to remove.                                                                                                                                                                                                                                    |
| y coordinate 1 to n  | integer  | The y coordinate of the top left pixel of each of the regions to remove.                                                                                                                                                                                                                                    |
| width 1 to n         | integer  | The width of each of the regions to remove in pixels.                                                                                                                                                                                                                                                       |
| height 1 to n        | integer  | The height of each of the regions to remove in pixels.                                                                                                                                                                                                                                                      |

#### Examples
Example 1: Remove the person from this image (`e_gen_remove:prompt_the%20person`): 
![Horse with rider removed](https://res.cloudinary.com/demo/image/upload/e_gen_remove:prompt_the%20person/docs/horse-with-rider.jpg "with_image:false")

Original image

Person removed

 Example 2: Remove the region that contains the man and the skateboard (`e_gen_remove:region_(x_300;y_200;w_1900;h_3500)`):
![Removed region](https://res.cloudinary.com/demo/image/upload/e_gen_remove:region_(x_300;y_200;w_1900;h_3500)/docs/man-skate.jpg "with_image:false")

Original image

Region removed

Example 3: Remove multiple regions (`e_gen_remove:region_((x_300;y_200;w_750;h_500);(x_1800;y_1200;w_1000;h_800))`):

![Removed regions](https://res.cloudinary.com/demo/image/upload/e_gen_remove:region_((x_300;y_200;w_750;h_500);(x_1800;y_1200;w_1000;h_800))/docs/accessories-bag.jpg "with_image:false")

Original image

Regions removed

Example 4: Remove all phones (`e_gen_remove:prompt_phone;multiple_true`):
![Removed phones](https://res.cloudinary.com/demo/image/upload/e_gen_remove:prompt_phone;multiple_true/docs/gadgets.jpg "with_image:false")

Original image

All phones removed

Example 5: Remove all phones, keyboards and mice (`e_gen_remove:prompt_(keyboard;phone;mouse)`):
![Removed blue phones, the keyboard and mouse](https://res.cloudinary.com/demo/image/upload/e_gen_remove:prompt_(keyboard;phone;mouse)/docs/gadgets "with_image:false")

Original image

Specified gadgets removed

Example 6: Remove the woman, together with her shadow (`e_gen_remove:prompt_woman;remove-shadow_true`):
![Removed woman, but shadow kept](https://res.cloudinary.com/demo/image/upload/e_gen_remove:prompt_the%20woman;remove-shadow_true/docs/woman-shadow "with_image:false")

Original image

Woman removed(shadow kept by default)

Woman and shadow removed

Example 7: Remove all text from the image (`e_gen_remove:prompt_text`):
![Removed text](https://res.cloudinary.com/demo/image/upload/e_gen_remove:prompt_text/docs/display "with_image:false")

Original image

All text removed

Example 8: Remove the text from the big England flag only (`e_gen_remove:prompt_text:the%20big%20england%20flag`):
![Removed text from the big England flag](https://res.cloudinary.com/demo/image/upload/e_gen_remove:prompt_text:the%20big%20england%20flag/docs/britain "with_image:false")

Original image

Text removed from the flag

### gen_replace
{actionType:type=image}&nbsp;`e_gen_replace:from_<from prompt>;to_<to prompt>[;preserve-geometry_<preserve geometry>][;multiple_<detect multiple>]`

Uses generative AI to replace parts of your image with something else. Use the `preserve-geometry` parameter to fill exactly the same shape with the replacement. 
> **NOTE**:
>
> :title=Notes and limitations:

> * The generative replace effect can only be used on non-transparent images.

> * The use of generative AI means that results may not be 100% accurate.

> * The generative replace effect works best on simple objects that are clearly visible.

> * Very small objects and very large objects may not be detected.

> * Don't attempt to replace faces, hands or text.

> * During processing, large images are downscaled to a maximum of 2048 x 2048 pixels, then upscaled back to their original size, which may affect quality.

> * There is a [special transformation count](./transformation_counts#special_effect_calculations) for the generative replace effect.

> * The generative replace effect isn't supported for [animated](./animated_images) images or [fetched](./fetch_remote_images#fetch_and_deliver_remote_files) images.

> * When Cloudinary is generating a derived version, you may get a 423 response returned until the version is ready. You can prepare derived versions in advance using an [eager transformation](./eager_and_incoming_transformations#eager_transformations).

> * When Cloudinary is generating an [incoming transformation](./eager_and_incoming_transformations#incoming_transformations), you may get a 420 response returned, with status `pending` until the asset is ready.

> * If you're using our [Asia Pacific data center](./admin_api#alternative_data_centers_and_endpoints_premium_feature), you currently can't apply the generative replace effect.
**Learn more**: [Generative replace](./generative_ai_transformations#generative_replace)

#### Syntax details
| Value             | Type     | Description                                                                                                                                                                                     |
| ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| from prompt       | string   | **Required.** A natural language description of what you want to replace in the image.                                                                                                          |
| to prompt         | string   | **Required.** A natural language description of what you want to replace the `from prompt` with.                                                                                                |
| preserve geometry | constant | Determines whether or not to use the exact shape of the original area for the replacement. Possible values: `true`: keep the same shape`false`: do not keep the same shape**Default**: `false`. |
| detect multiple   | constant | Replace all instances of the prompt in the image.Possible values: `true`: enable multiple detections`false`: disable multiple detections**Default**: `false`.                                   |

#### Examples
{collapsed}

Example 1: Replace "the picture" with "a mirror with a silver frame" (`e_gen_replace:from_the%20picture;to_a%20mirror%20with%20a%20silver%20frame`): 
![Picture replaced with window](https://res.cloudinary.com/demo/image/upload/e_gen_replace:from_the%20picture;to_a%20mirror%20with%20a%20silver%20frame/docs/chair.jpg "with_image:false")

<img src="https://res.cloudinary.com/demo/image/upload/c_scale,h_200/docs/chair.jpg" alt="Original image with a picture on the wall" title="Original image with a picture on the wall" style="margin-right: 30px;display:block;" />
Original image

Picture replacedwith mirror

 Example 2: Replace "the picture" with "a Van Gogh style painting of cornfields", keeping the area of the replacement exactly the same (`e_gen_replace:from_the%20picture;to_a%20van%20gogh%20style%20painting%20of%20cornfields;preserve-geometry_true`):
![Replaced picture, preserving geometry](https://res.cloudinary.com/demo/image/upload/e_gen_replace:from_the%20picture;to_a%20van%20gogh%20style%20painting%20of%20cornfields;preserve-geometry_true/docs/chair.jpg "with_image:false")

Original image

Exact area ofpicture replaced

 Example 3: Replace all the rectangle frames with clocks (`e_gen_replace:from_rectangle%20frame;to_clock;multiple_true`):
![Replaced frames with clocks](https://res.cloudinary.com/demo/image/upload/e_gen_replace:from_rectangle%20frame;to_clock;multiple_true/docs/frames.jpg "with_image:false")

Original image

Frames replacedwith clocks

{/collapsed}

{/actionType}

### gen_restore
&nbsp;`e_gen_restore`

Uses generative AI to restore details in poor quality images or images that may have become degraded through repeated processing and compression.

Consider also using the [improve](#e_improve) effect to automatically adjust color, contrast and brightness, or the [enhance](#e_enhance) effect to improve the appeal of an image based on AI analysis. See this [comparison of image enhancement options](./effects_and_artistic_enhancements#image_enhancement_options).

{note:title=Notes and limitations:}

* The generative restore effect can only be used on non-transparent images.
* The use of generative AI means that results may not be 100% accurate.
* There is a [special transformation count](./transformation_counts#special_effect_calculations) for the generative restore effect.
* The generative restore effect isn't supported for [animated](./animated_images) images or [fetched](./fetch_remote_images#fetch_and_deliver_remote_files) images.
* When Cloudinary is generating a derived version, you may get a 423 response returned until the version is ready. You can prepare derived versions in advance using an [eager transformation](./eager_and_incoming_transformations#eager_transformations).
* When Cloudinary is generating an [incoming transformation](./eager_and_incoming_transformations#incoming_transformations), you may get a 420 response returned, with status `pending` until the asset is ready.

{/note}
**See also**: [e_enhance](#e_enhance) | [e_improve](#e_improve)

**Learn more**: [Generative restore](./generative_ai_transformations#generative_restore)

#### Example
Revitalize an old photo:

![Old photo of couple](https://res.cloudinary.com/demo/image/upload/e_gen_restore/docs/old-photo.jpg "thumb: h_150")

### gradient_fade
&nbsp;`e_gradient_fade[:<type>][:<strength>]`

Applies a gradient fade effect from the edge of an image. Use x or y to indicate from which edge to fade and how much of the image should be faded. Values of x and y can be specified as a percentage (range: `0.0 to 1.0`), or in pixels (integer values). Positive values fade from the top (y) or left (x). Negative values fade from the bottom (y) or right (x). By default, the gradient is applied to the top 50% of the image (`y_0.5`).

#### Optional qualifiers
[x, y (x & y coordinates)](#x_y_coordinates)

#### Syntax details
| Value    | Type     | Description                                                                                                                                                                                           |
| -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type     | constant | Whether to apply symmetry to the fade.**Possible values**: `symmetric`: Fade symmetrically from multiple edges`symmetric_pad`: Fade the image into the added padding**Default**: No symmetry applied. |
| strength | integer  | The strength of the fade effect **Range**: `0 to 100`. **Default**: `20`.                                                                                                                             |

#### Examples
1. Apply a gradient fade effect symmetrically to all edges (20% to the sides of an image and 40% to the top and bottom, with a strength of 10  (`e_gradient_fade:symmetric:10,x_0.2,y_0.4`):

    ![Horse image with fade applied symmetrically to all edges](https://res.cloudinary.com/demo/image/upload/e_gradient_fade:symmetric:10,x_0.2,y_0.4/horses.jpg "thumb: h_150")

2. Pad an image to a width of 200 pixels and a height of 150 pixels, with the background color set to the predominant color, and with a gradient fade effect between the added padding and the image (`e_gradient_fade:symmetric_pad`): 
    ![Balloons fading into the padding](https://res.cloudinary.com/demo/image/upload/b_auto:predominant,c_pad,h_150,w_200/e_gradient_fade:symmetric_pad/docs/hot-air-balloons.jpg "thumb: h_150")

### grayscale
&nbsp;`e_grayscale`

Converts an image to grayscale (multiple shades of gray).

#### Example
Convert an image to grayscale (`e_grayscale`):

![Horse image in grayscale](https://res.cloudinary.com/demo/image/upload/e_grayscale/horses.jpg "thumb: h_150")

### green
&nbsp;`e_green[:<level>]`

Adjust an image's green channel.

#### Syntax details
| Value | Type    | Description                                                     |
| ----- | ------- | --------------------------------------------------------------- |
| level | integer | The level of green. **Range**: `-100 to 100`. **Default**: `0`. |

#### Example
Adjust an image's green channel to -30 (`e_green:-30`):

![Green channel adjusted in image to -30](https://res.cloudinary.com/demo/image/upload/e_green:-30/horses.jpg "thumb: h_150")

### hue
&nbsp;`e_hue[:<level>]`

Adjusts an image's hue.

#### Syntax details
| Value | Type    | Description                                                    |
| ----- | ------- | -------------------------------------------------------------- |
| level | integer | The level of hue. **Range**: `-100 to 100`. **Default**: `80`. |

#### Example
Adjust an image's hue to 40 (`e_hue:40`):

![Hue adjusted in image to 40](https://res.cloudinary.com/demo/image/upload/e_hue:40/horses.jpg "thumb: h_150")

### improve
&nbsp;`e_improve[:<mode>][:<blend>]`

Adjusts an image's colors, contrast and brightness to improve its appearance.

Consider also using [generative restore](#e_gen_restore) to revitalize poor quality images, or the [enhance](#e_enhance) effect to improve the appeal of an image based on AI analysis. See this [comparison of image enhancement options](./effects_and_artistic_enhancements#image_enhancement_options).

**See also**: [e_enhance](#e_enhance) | [e_gen_restore](#e_gen_restore)

#### Syntax details
| Value | Type     | Description                                                                                                                                                                               |
| ----- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mode  | constant | The type of improvements to make. Use `indoor` mode to get better results on images with indoor lighting and shadows.  **Possible values**: `outdoor`, `indoor`. **Default**: `outdoor`.  |
| blend | integer  | How much to blend the improved result with the original image, where 0 means use only the original and 100 means use only the improved result. **Range**: `0 to 100`. **Default**: `100`. |

#### Examples
1. Automatically improve the colors, contrast and brightness, blending to 50% (`e_improve:50`):
    ![Improved image of horses](https://res.cloudinary.com/demo/image/upload/e_improve:50/horses.jpg "thumb: h_150")

1. Improve the visual quality of an image (`e_improve:indoor`):
    ![Improved indoor image](https://res.cloudinary.com/demo/image/upload/e_improve:indoor/hallway.jpg "thumb: h_150")

### light
&nbsp;`e_light[:shadowintensity_<intensity>]`

When generating a 2D image from a 3D model, this effect introduces a light source to cast a shadow. You can control the intensity of the shadow that's cast.

{note}
You must specify a 2D image file format that supports transparency, such as PNG or AVIF.
{/note}

**Use with**: [f (format)](#f_supported_format) | [e_camera](#e_camera)

**Learn more**: [Generating an image from a 3D model](./transformations_on_3d_models#generating_an_image_from_a_3d_model)

#### Syntax details
| Value     | Type    | Description                                                              |
| --------- | ------- | ------------------------------------------------------------------------ |
| intensity | integer | The intensity of the shadow. **Range**: `0` to `100`. **Default**: `30`. |

#### Examples
1. Capture a PNG image of the `cute-kitty` 3D model (`f_png`) with the camera positioned at an angle of 45 degrees above the cat (`up_45`), rotated 60 degrees to the left (`right_-60`) and default shadow intensity (`e_light`): 
   ![Image of cute kitty model from a particular angle with default shadow](https://res.cloudinary.com/demo/image/upload/c_scale,h_150/e_camera:up_45;right_-60/e_light/f_png/docs/cute-kitty "thumb: h_150")
1. Create a 360 animation of the `cute-kitty` 3D model (`fl_animated,f_webp`) with the camera positioned 60 degrees up and starting at 45 degrees to the right, capturing 36 frames (`e_camera:up_60;right_45;frames_36`), and with a shadow intensity of 50 (`e_light:shadowintensity_50`):
   ![360 animation of cute kitty model](https://res.cloudinary.com/demo/image/upload/c_scale,h_150/e_camera:up_60;right_45;frames_36/e_light:shadowintensity_50/fl_animated,f_webp/docs/cute-kitty "thumb: h_150")
   
      "Cute Little Kitty" [https://skfb.ly/ospAT](https://skfb.ly/ospAT) by Diskette96 is licensed under [Creative Commons Attribution](http://creativecommons.org/licenses/by/4.0/).

### loop
&nbsp;`e_loop[:<additional iterations>]`

Loops a video or animated image the specified number of times.

#### Syntax details
| Value                 | Type    | Description                                                                                                                                                             |
| --------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| additional iterations | integer | **Required for video.** The number of additional times to play the video or animated image. For animated images only, this can be omitted to loop the image infinitely. |

#### Example
Play an animated GIF three times (two additional times) (`e_loop:2`):
    
![Animated GIF of ball on a spring](https://res.cloudinary.com/demo/image/upload/e_loop:2/spiral_animated.gif "thumb: h_150")

### make_transparent
&nbsp;`e_make_transparent[:<tolerance>]`

Makes the background of an image or video transparent (or solid white for formats that do not support transparency). The background is determined as all pixels that resemble the pixels on the edges of an image or video, or the color specified by the `color` qualifier. 

{tip:title=Tips}

* For images with a uniform background, you may also want to try the [e_bgremoval](#e_bgremoval) effect. 
* If neither `e_make_transparent` nor `e_bgremoval` give the desired result, it's recommended to try the [e_background_removal](#e_background_removal) effect.
* You can also try the [Pixelz Remove the Background add-on](./remove_the_background_image_editing_addon) for professional manual background removal.
{/tip}

#### Optional qualifier
[color](#co_color)

**Learn more**: [Apply video transparency](./video_effects_and_enhancements#transparency)

#### Syntax details
| Value     | Type    | Description                                                                                              |
| --------- | ------- | -------------------------------------------------------------------------------------------------------- |
| tolerance | integer | The tolerance to accommodate variance in the background color. **Range**: `0 to 100`. **Default**: `10`. |

#### Examples
1. Make the background of an image transparent, with a tolerance of 5 (`e_make_transparent:5`):
    
    ![Woman with transparent background](https://res.cloudinary.com/demo/image/upload/e_make_transparent:5/fashion_gravity.png "thumb: h_150")
1. Make blue the transparent color with a tolerance of 40 (`co_blue,e_make_transparent:40`):
    ![Woman with transparent areas where blue was in the original picture](https://res.cloudinary.com/demo/image/upload/co_blue,e_make_transparent:40/fashion_gravity.png "thumb: h_150")

### mask
&nbsp;`e_mask`

A [qualifier](#parameter_types) that uses an image layer as a mask to hide, reveal, or change the opacity of the layer below it.
{note}
The same [layer transformation syntax](./layers#layer_transformation_syntax) rules apply, including for [authenticated or private assets](./layers#authenticated_or_private_layers).
{/note}
**Use with**: [l_\<image id\>](#l_image_id) | [l_fetch](#l_fetch) | [l_text](#l_text)  | [u_\<image id\>](#u_image_id) | [u_fetch](#u_fetch)

#### Example
Use a black, feathered square shape, sized at 50% of the base image width (`c_scale,fl_relative,w_0.5`), as a mask over the horse image (`l_square_feather/e_mask,fl_layer_apply`):
    
![Horse image with Cloudinary icon overlaid](https://res.cloudinary.com/demo/image/upload/l_square_feather/c_scale,fl_relative,w_0.5/e_mask,fl_layer_apply/horses.jpg "thumb: h_150")

### morphology
&nbsp;`e_morphology[:method_<method>][;iterations_<iterations>][;kernel_<kernel>][;radius_<radius>]`

Applies kernels of various sizes and shapes to an image using different methods to achieve effects such as image blurring and sharpening.

{note}This transformation also supports [non-verbose, ordered](./image_transformations#verbose_vs_non_verbose_syntax) syntax.{/note}

#### Syntax details
| Value      | Type    | Description                                                                                                                                               |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| method     | string  | The method in which the kernel is applied to the image. **Possible values**: `dilate`, `erode`, `convolve`. **Default**: `erode`.                         |
| iterations | integer | The number of times to apply the effect. **Range**: `1 to 5`. **Default**: `1`.                                                                           |
| kernel     | string  | The shape of the kernel to use for the effect. **Possible values**: `octagon`, `diamond`, `square`, `disk`, `plus`, `cross`, `ring`. **Default**: `disk`. |
| radius     | float   | The radius of the kernel. **Default**: `2.0`.                                                                                                             |

#### Examples
1. Blur a picture of a giraffe by applying the default disk-shaped kernel using the erode method five times (`e_morphology:iterations_5`):
    ![Giraffe with erode morphology - looks darker](https://res.cloudinary.com/demo/image/upload/e_morphology:iterations_5/docs/giraffe.jpg "thumb: h_150")
1. Emphasize the lines in a line drawing of a kitten by applying a plus-shaped kernel of 5 pixels using the dilate method (`e_morphology:method_dilate;kernel_plus;radius_5.0`):
    ![Cat drawing with dilate morphology](https://res.cloudinary.com/demo/image/upload/e_morphology:method_dilate;kernel_plus;radius_5.0/docs/kitten-drawing.png "thumb: h_150")
1. Apply convolution to a market picture (`e_morphology:method_convolve;radius_1.0`):
    ![Market scene with convolution applied](https://res.cloudinary.com/demo/image/upload/e_morphology:method_convolve;radius_1.0/docs/souk.jpg "thumb: h_150")    

### multiply
&nbsp;`e_multiply`

A [qualifier](#parameter_types) that blends image layers using the **multiply** blend mode, whereby the RGB channel numbers for each pixel from the top layer are multiplied by the values for the corresponding pixel from the bottom layer. The result is always a darker picture; since each value is less than 1, their product will be less than either of the initial values.
{note}
The same [layer transformation syntax](./layers#layer_transformation_syntax) rules apply, including for [authenticated or private assets](./layers#authenticated_or_private_layers).
{/note}
**Use with**: [l_\<image id\>](#l_image_id) | [l_fetch](#l_fetch) | [l_text](#l_text)  | [u_\<image id\>](#u_image_id) | [u_fetch](#u_fetch)

**See also**: Other blend modes: [e_mask](#e_mask) | [e_overlay](#e_overlay) | [e_screen](#e_screen)

#### Example
Overlay the Cloudinary icon on an image, using the multiply effect (`l_cloudinary_icon_blue/e_multiply,fl_layer_apply`):
    
![Horse image with Cloudinary icon overlaid](https://res.cloudinary.com/demo/image/upload/l_cloudinary_icon_blue/e_multiply,fl_layer_apply/horses.jpg "thumb: h_150")

### negate
&nbsp;`e_negate`

Creates a negative of an image.

#### Example
Make a negative of an image (`e_negate`):
    
![A negative image](https://res.cloudinary.com/demo/image/upload/e_negate/horses.jpg "thumb: h_150")

### noise
&nbsp;`e_noise[:<level>]`

Adds visual noise to the video, visible as a random flicker of "dots" or "snow".

**Learn more**: [Add visual noise](./video_effects_and_enhancements#visual_noise)

#### Syntax details
| Value | Type    | Description                                                         |
| ----- | ------- | ------------------------------------------------------------------- |
| level | integer | The level of noise to add. **Range**: `0 to 100`. **Default**: `0`. |

#### Example
Add noise to a video (`e_noise:100`):
    
![A video with noise added](https://res.cloudinary.com/demo/video/upload/h_250/e_noise:100/docs/green_screen_queen.mp4)

### oil_paint
&nbsp;`e_oil_paint[:<strength>]`

Applies an oil painting effect.

#### Syntax details
| Value    | Type    | Description                                                           |
| -------- | ------- | --------------------------------------------------------------------- |
| strength | integer | The strength of the effect. **Range**: `0 to 100`. **Default**: `30`. |

#### Example
Apply an oil painting effect to an image (`e_oil_paint:40`):
    
![Image with oil paint effect](https://res.cloudinary.com/demo/image/upload/e_oil_paint:40/horses.jpg "thumb: h_150")

### opacity_threshold
&nbsp;`e_opacity_threshold[:<level>]`

Causes all semi-transparent pixels in an image to be either fully transparent or fully opaque. Specifically, each pixel with an opacity lower than the specified threshold level is set to an opacity of 0% (transparent). Each pixel with an opacity greater than or equal to the specified level is set to an opacity of 100% (opaque). 

{note}
This effect can be a useful solution when Photoshop PSD files are delivered in a format supporting partial transparency, such as PNG, and the results without this effect are not as expected.
{/note}

#### Syntax details
| Value | Type    | Description                                                            |
| ----- | ------- | ---------------------------------------------------------------------- |
| level | integer | The opacity threshold level. **Range**: `1 to 100`. **Default**: `50`. |

#### Example
Make this semi-transparent logo fully opaque (`e_opacity_threshold:1`):
    
![Fully opaque logo](https://res.cloudinary.com/demo/image/upload/e_opacity_threshold:1/b_blue/docs/logo-semi-opaque.png "thumb: h_150")

### ordered_dither
&nbsp;`e_ordered_dither[:<type>]`

Applies an ordered dither filter to an image.

#### Syntax details
| Value | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type  | constant | The type of ordered dither to apply. **Possible values**: `0`: Threshold 1x1 (non-dither)`1`: Checkerboard 2x1 (dither)`2`: Ordered 2x2 (dispersed)`3`: Ordered 3x3 (dispersed)`4`: Ordered 4x4 (dispersed)`5`: Ordered 8x8 (dispersed)`6`: Halftone 4x4 (angled)`7`: Halftone 6x6 (angled)`8`: Halftone 8x8 (angled)`9`: Halftone 4x4 (orthogonal)`10`: Halftone 6x6 (orthogonal)`11`: Halftone 8x8 (orthogonal)`12`: Halftone 16x16 (orthogonal)`13`: Circles 5x5 (black)`14`: Circles 5x5 (white)`15`: Circles 6x6 (black))`16`: Circles 6x6 (white)`17`: Circles 7x7 (black)`18`: Circles 7x7 (white)**Default**: `0`. |

#### Example
Apply an ordered dither of type halftone 16x16 (orthogonal) to an image (`e_ordered_dither:12`):
    
![Image with ordered dither applied](https://res.cloudinary.com/demo/image/upload/e_ordered_dither:12/horses.jpg "thumb: h_150")

### outline
&nbsp;`e_outline[:<mode>][:<width>][:<blur>]`

Adds an outline effect to an image. Specify the color of the outline using the [co (color)](#co_color) qualifier. If no color is specified, the default outline is black.

#### Optional qualifier
[co (color)](#co_color)

**Learn more**: [Outline effects](./effects_and_artistic_enhancements#outline)

#### Syntax details
| Value | Type     | Description                                                                                                                                                                                                                                                                                                        |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| mode  | constant | Where to apply the outline effect: **Possible values**: `inner`: Applies an outline to the inner edge`inner_fill`: Fills the inner part of an image`outer`: Applies an outline to the outer edge`fill`: Applies an outline to the outer edge and fills the inner part of an image**Default**: `inner` and `outer`. |
| width | integer  | The thickness of the outline in pixels. **Range**: `1 to 100`. **Default**: `5`.                                                                                                                                                                                                                                   |
| blur  | integer  | The level of blur to apply to the outline. **Range**: `1 to 200`. **Default**: `0`.                                                                                                                                                                                                                                |

#### Example
Add an orange outline effect to the outer border of an image, with a width of 15 pixels and a blur value of 200 (`e_outline:outer:15:200`):
    
![Balloon image with outline applied](https://res.cloudinary.com/demo/image/upload/co_orange,e_outline:outer:15:200/balloon.png "thumb: h_150")

### overlay
&nbsp;`e_overlay`

A [qualifier](#parameter_types) that blends image layers using the **overlay** blend mode, which combines the [multiply](#e_multiply) and [screen](#e_screen) blend modes. The parts of the top layer where the base layer is light become lighter, the parts where the base layer is dark become darker. Areas where the top layer are mid gray are unaffected.
{note}
The same [layer transformation syntax](./layers#layer_transformation_syntax) rules apply, including for [authenticated or private assets](./layers#authenticated_or_private_layers).
{/note}
**Use with**: [l_\<image id\>](#l_image_id) | [l_fetch](#l_fetch) | [l_text](#l_text) | [u_\<image id\>](#u_image_id) | [u_fetch](#u_fetch)

**See also**: Other blend modes: [e_mask](#e_mask) | [e_multiply](#e_multiply) | [e_screen](#e_screen)

#### Example
Overlay the Cloudinary icon on an image using the overlay effect (`l_cloudinary_icon_blue/e_overlay,fl_layer_apply`):
    
![An image with Cloudinary icon overlaid](https://res.cloudinary.com/demo/image/upload/l_cloudinary_icon_blue/e_overlay,fl_layer_apply/horses.jpg "thumb: h_150")

### pixelate
&nbsp;`e_pixelate[:<square size>]`

Applies a pixelation effect.

#### Syntax details
| Value       | Type    | Description                                                                                                                                  |
| ----------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| square size | integer | The width in pixels of each pixelation square. **Range**: `1 to 200`. **Default**: Determined by an algorithm based on the image dimensions. |

#### Example
Apply a pixelation effect with pixelation squares that are 20 pixels wide (`e_pixelate:20`):
    
![Pixelated image](https://res.cloudinary.com/demo/image/upload/e_pixelate:20/horses.jpg "thumb: h_150")

### pixelate_faces
&nbsp;`e_pixelate_faces[:<square size>]`

Pixelates all detected faces in an image.

#### Syntax details
| Value       | Type    | Description                                                                                                                                  |
| ----------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| square size | integer | The width in pixels of each pixelation square. **Range**: `1 to 200`. **Default**: Determined by an algorithm based on the image dimensions. |

#### Example
Pixelate all detected faces in an image with pixelation squares that are 15 pixels wide (`e_pixelate_faces:15`):
    
![Pixelated faces](https://res.cloudinary.com/demo/image/upload/e_pixelate_faces:15/couple.jpg "thumb: h_150")

### pixelate_region
&nbsp;`e_pixelate_region[:<square size>]`

Pixelates the region of an image specified by x, y, width and height, or an area of text. If no region is specified, the whole image is pixelated.

#### Optional qualifiers
[x, y (x & y coordinates)](#x_y_coordinates) | [w (width)](#w_width) | [h (height)](#h_height) | [g_ocr_text](#g_special_position)

#### Syntax details
| Value       | Type    | Description                                                                                                                                  |
| ----------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| square size | integer | The width in pixels of each pixelation square. **Range**: `1 to 200`. **Default**: Determined by an algorithm based on the image dimensions. |

#### Examples
1. Pixelate the region of an image specified by a rectangle with a width of 500 pixels, a height of 425 pixels, and starting at coordinates (600,400), using pixelation squares that are 35 pixels wide (`e_pixelate_region:35,h_425,w_550,x_600,y_400`):
![Part of an image is pixelated](https://res.cloudinary.com/demo/image/upload/e_pixelate_region:35,h_425,w_550,x_600,y_400/horses.jpg "thumb: h_150")

2. Pixelate the bottom quarter of an image, using pixelation squares that are 25 pixels wide (`e_pixelate_region:25,y_0.75`):
![Bottom quarter of an image is pixelated](https://res.cloudinary.com/demo/image/upload/e_pixelate_region:25,y_0.75/horses.jpg "thumb: h_150")

3. Pixelate a car number plate, using pixelation squares of 20 pixels wide together with the [OCR Text Detection](./ocr_text_detection_and_extraction_addon) add-on  (`e_pixelate_region:20,g_ocr_text`):
![Car with pixelated number plate](https://res.cloudinary.com/demo/image/upload/e_pixelate_region:20,g_ocr_text/black_car.jpg "thumb: h_150")

### preview
&nbsp;`e_preview[:duration_<duration>][:max_seg_<max segments>][:min_seg_dur_<min segment duration>]`

Generates a summary of a video based on Cloudinary's AI-powered preview algorithm, which identifies the most interesting video segments in a video and uses these to generate a video preview.

{notes}

* There are [special transformation counts](./transformation_counts#video_ai) for videos using `e_preview`.
* If you're using our [Asia Pacific data center](./admin_api#alternative_data_centers_and_endpoints_premium_feature), you currently can't apply `e_preview`.

{/notes}

#### Optional qualifier
[fl_getinfo](#fl_getinfo)

**Learn more**: [Generate an AI-based video preview](./video_effects_and_enhancements#ai_based_video_preview)

#### Syntax details
| Value                | Type    | Description                                                                                                                                                                             |
| -------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| duration             | float   | The total duration of the video summarization in seconds. **Default**: `5.0`.                                                                                                           |
| max segments         | integer | The maximum number of segments in the summary. **Default**: `1` (if duration is not specified, otherwise [based on duration](./video_effects_and_enhancements#ai_based_video_preview)). |
| min segment duration | float   | The minimum duration for a segment. **Default**: `5.0`(if duration is not specified, otherwise [based on duration](./video_effects_and_enhancements#ai_based_video_preview)).           |

#### Example
Generate a 12 second preview from a video, with a maximum of 3 segments and a minimum segment duration of 3 seconds (`e_preview:duration_12.0:max_seg_3:min_seg_dur_3.0`):

![Preview of Imagecon video](https://res.cloudinary.com/demo/video/upload/e_preview:duration_12.0:max_seg_3:min_seg_dur_3.0/imagecon_grigsby_intro.mp4 "thumb: h_150")

### progressbar
&nbsp;`e_progressbar[:type_<bar type>][:color_<bar color>][:width_<width>]`

Adds a progress indicator overlay to a video.

{note}This transformation also supports [non-verbose, ordered](./image_transformations#verbose_vs_non_verbose_syntax) syntax.{/note}

**Learn More**: [Add a video progress indicator](./video_effects_and_enhancements#progress_indicator)

#### Syntax details
| Value     | Type     | Description                                                                                                                                                                                                                                                                                                                            |
| --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bar type  | constant | The type of progress indicator to overlay. **Possible values**:`bar`: Draws a single progress bar across the bottom of the video, starting on the left and ending on the right. `frame`: Draws a frame around the video, starting in the bottom left and going both ways around the video, ending in the top right.**Default**: `bar`. |
| bar color | string   | The color of the indicator. It can be specified as an RGB hex triplet (e.g. `3e2222`) or a named color (e.g. `green`). **Default**: `red`.                                                                                                                                                                                             |
| width     | integer  | The width of the indicator in pixels. **Default**: `10`.                                                                                                                                                                                                                                                                               |

#### Examples
1. Add an olive green **frame** style progress indicator using RGB color and ordered syntax (`e_progressbar:frame:494635:8`):
![ecommerce video with frame progress indicator](https://res.cloudinary.com/demo/video/upload/e_progressbar:frame:494635:8/docs/shoppable_demo.mp4 "thumb:ac_none, height:150, with_image:false")

  
  
  

1. Add a green **bar** style progress indicator using verbose syntax (`e_progressbar:type_bar:color_green:width_6`):
![vacation video with frame progress indicator](https://res.cloudinary.com/demo/video/upload/e_progressbar:type_bar:color_green:width_6/docs/boat_aerial.mp4 "thumb:ac_none, height:150, with_image:false")

### recolor
&nbsp;`e_recolor:<value1>:<value2>:...:<value9>[<value10>:<value11>:...:<value16>]`

Converts the colors of every pixel in an image based on a supplied color matrix, in which the value of each color channel is calculated based on the values from all other channels (e.g. a 3x3 matrix for RGB, a 4x4 matrix for RGBA or CMYK, etc).

#### Syntax details
| Value             | Type  | Description                                             |
| ----------------- | ----- | ------------------------------------------------------- |
| value1 to value9  | float | 3x3 matrix of values used to recolor a 3-channel image. |
| value1 to value16 | float | 4x4 matrix of values used to recolor a 4-channel image. |

#### Example
Recolor a 3-channel RGB image to new values according to the 3x3 matrix (`e_recolor:0.3:0.7:0.1:0.3:0.6:0.1:0.2:0.5:0.1`):

R = R\*0.3 + G\*0.7 + B\*0.1
G = R\*0.3 + G\*0.6 + B\*0.1
B = R\*0.2 + G\*0.5 + B\*0.1

![Recolored image according to the matrix](https://res.cloudinary.com/demo/image/upload/e_recolor:0.3:0.7:0.1:0.3:0.6:0.1:0.2:0.5:0.1/horses.jpg "thumb: h_150")

### red
&nbsp;`e_red[:<level>]`

Adjust an image's red channel.

#### Syntax details
| Value | Type    | Description                                                   |
| ----- | ------- | ------------------------------------------------------------- |
| level | integer | The level of red. **Range**: `-100 to 100`. **Default**: `0`. |

#### Example
Adjust an image's red channel to 50 (`e_red:50`):

![Red channel adjusted in image to 50](https://res.cloudinary.com/demo/image/upload/e_red:50/horses.jpg "thumb: h_150")

### redeye
&nbsp;`e_redeye`

Automatically removes red eyes in an image.

#### Example
Apply red eye removal to this picture (`e_redeye`):

![Face with red eye removed](https://res.cloudinary.com/demo/image/upload/e_redeye/docs/redeyeman.jpg "thumb: h_150")

### replace_color
&nbsp;`e_replace_color:<to color>[:<tolerance>][:<from color>]`

Maps an input color and those similar to the input color to corresponding shades of a specified output color, taking luminosity and chroma into account, in order to recolor an object in a natural way. More highly saturated input colors usually give the best results. It is recommended to avoid input colors approaching white, black, or gray.

{notes}

* This transformation only supports [non-verbose, ordered](./image_transformations#verbose_vs_non_verbose_url_transformation_syntax) syntax, so remember to include the `tolerance` parameter if specifying `from color`, even if you intend to use the default tolerance.
* Consider using [e_gen_recolor](#e_gen_recolor) if you want to specify particular elements in your image to recolor, rather than everything with the same color.

{/notes}

**Learn more**: [Replace color](./effects_and_artistic_enhancements#replace_color_effect)

**See also**: [e_gen_recolor](#e_gen_recolor)

#### Syntax details
| Value      | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| to color   | string  | **Required.** The HTML name or RGB/A hex code of the target output color.                                                                                                                                                                                                                                                                                                                                           |
| tolerance  | integer | The tolerance threshold (a radius in the LAB color space) from the input color, representing the span of colors that should be replaced with a correspondingly adjusted version of the target output color. Larger values result in replacing more colors within an image. The more saturated the original input color, the more a change in value will impact the result.**Range**: `0 to 100`. **Default**: `50`. |
| from color | string  | The HTML name or RGB/A hex code of the base input color to map.**Default**: The most prominent high-saturation color in an image.                                                                                                                                                                                                                                                                                   |

#### Examples
1. Change the prominent (green) color in an image to a saddlebrown color, using the default tolerance (`e_replace_color:saddlebrown`):
    ![Jumper with color replaced](https://res.cloudinary.com/demo/image/upload/e_replace_color:saddlebrown/green_shirt_bhrxf4.png "thumb: h_150")
1. Change the prominent (red) color in an image to the specified (greenish_gray) hex color, using a tolerance of 20 (`e_replace_color:2F4F4F:20`):
    ![Pool table with color replaced](https://res.cloudinary.com/demo/image/upload/e_replace_color:2F4F4F:20/pooltable.png "thumb: h_150")
1. Change the specified (royal blue) hex color in an image to a silver color, using a tolerance of 55 (`e_replace_color:silver:55:89b8ed`):
    ![Gazebo with color replaced](https://res.cloudinary.com/demo/image/upload/e_replace_color:silver:55:89b8ed/blue_gazeebo.png "thumb: h_150")

### reverse
&nbsp;`e_reverse`

Plays a video or audio file in reverse.

#### Example
Play a video in reverse (`e_reverse`):

![Video played backwards](https://res.cloudinary.com/demo/video/upload/e_reverse/pencil_sketch.mp4 "thumb: h_150")

### saturation
&nbsp;`e_saturation[:<level>]`

Adjusts an image or video saturation level.

#### Syntax details
| Value | Type    | Description                                                                                                          |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| level | integer | The level of saturation. The lower the number the lower the saturation. **Range**: `-100 to 100`. **Default**: `80`. |

#### Example
Adjust image saturation to 70 (`e_saturation:70`):

![Image delivered with saturation 70](https://res.cloudinary.com/demo/image/upload/e_saturation:70/horses.jpg "thumb: h_150")

### screen
&nbsp;`e_screen`

A [qualifier](#parameter_types) that blends image layers using the **screen** blend mode, whereby the RGB channel numbers of the pixels in the two layers are inverted, multiplied, and then inverted again. This yields the opposite effect to [multiply](#e_multiply), and results in a brighter picture.
{note}
The same [layer transformation syntax](./layers#layer_transformation_syntax) rules apply, including for [authenticated or private assets](./layers#authenticated_or_private_layers).
{/note}
**Use with**: [l_\<image id\>](#l_image_id) | [l_fetch](#l_fetch) | [l_text](#l_text) | [u_\<image id\>](#u_image_id) | [u_fetch](#u_fetch)

**See also**: Other blend modes: [e_mask](#e_mask) | [e_multiply](#e_multiply) | [e_overlay](#e_overlay)

#### Example
Overlay the Cloudinary icon on an image using the screen effect (`l_cloudinary_icon_blue/e_screen,fl_layer_apply`):
    
![An image with the Cloudinary icon overlaid using the screen effect](https://res.cloudinary.com/demo/image/upload/l_cloudinary_icon_blue/e_screen,fl_layer_apply/horses.jpg "thumb: h_150")

### sepia
&nbsp;`e_sepia[:<level>]`

Changes the color scheme of an image to sepia.

#### Syntax details
| Value | Type    | Description                                                            |
| ----- | ------- | ---------------------------------------------------------------------- |
| level | integer | The level of sepia to apply. **Range**: `1 to 100`. **Default**: `80`. |

#### Example
Apply a sepia effect with a level of 50 (`e_sepia:50`):

![Sepia effect applied to an image](https://res.cloudinary.com/demo/image/upload/e_sepia:50/horses.jpg "thumb: h_150")

### shadow
&nbsp;`e_shadow[:<strength>]`

Adds a gray shadow to the bottom right of an image. You can change the color and location of the shadow using the color and x,y [qualifiers](#parameter_types).

#### Optional qualifiers
[x, y (x & y coordinates)](#x_y_coordinates) | [co (color)](#co_color)

**Learn more**: [Shadow effect](./effects_and_artistic_enhancements#shadow_effect)

**See also**: [e_dropshadow](#e_dropshadow)

#### Syntax details
| Value    | Type    | Description                                                                                    |
| -------- | ------- | ---------------------------------------------------------------------------------------------- |
| strength | integer | The strength of the blur on the edges of the shadow. **Range**: `0 to 100`. **Default**: `40`. |

#### Example
Add a green shadow with a strength of 50, and with an offset of 15 pixels to the left and 15 pixels down (`co_rgb:1a8502,e_shadow:50,x_-15,y_15`):

![Horses image with green shadow](https://res.cloudinary.com/demo/image/upload/co_rgb:1a8502,e_shadow:50,x_-15,y_15/horses.jpg "thumb: h_150")

### sharpen
&nbsp;`e_sharpen[:<strength>]`

Applies a sharpening filter.

#### Syntax details
| Value    | Type    | Description                                                                        |
| -------- | ------- | ---------------------------------------------------------------------------------- |
| strength | integer | The strength of the sharpening filter. **Range**: `1 to 2000`. **Default**: `100`. |

#### Example
Apply a sharpening filter with a strength of 400 (`e_sharpen:400`):

![Sharpening effect applied to horse image](https://res.cloudinary.com/demo/image/upload/e_sharpen:400/horses.jpg "thumb: h_150")

### shear
&nbsp;`e_shear:<x-skew>:<y-skew>`

Skews an image according to the two specified values in degrees. Negative values skew an image in the opposite direction.

#### Syntax details
| Value  | Type  | Description                                                                         |
| ------ | ----- | ----------------------------------------------------------------------------------- |
| x-skew | float | **Required.** The angle of skew on the x-axis in degrees. **Range**: `-359 to 359`. |
| y-skew | float | **Required.** The angle of skew on the y-axis in degrees. **Range**: `-359 to 359`. |

#### Example
Skew an image on the x-axis by 20 degrees (`e_shear:20.0:0.0`):

![Skewed horse image](https://res.cloudinary.com/demo/image/upload/e_shear:20.0:0.0/horses.jpg "thumb: h_150")

### simulate_colorblind
&nbsp;`e_simulate_colorblind[:<condition>]`

Simulates the way an image would appear to someone with the specified color blind condition.

**Learn more**: [Blog post](https://cloudinary.com/blog/open_your_eyes_to_color_accessibility)

#### Syntax details
| Value     | Type     | Description                                                                                                                                                                                                   |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| condition | constant | The color blind condition to simulate. **Possible values**: `deuteranopia`, `protanopia`, `tritanopia`, `tritanomaly`, `deuteranomaly`, `cone_monochromacy`, `rod_monochromacy`. **Default**: `deuteranopia`. |

#### Example
Simulate the way a mainly red and green image would appear to someone with protanopia color blindness (`e_simulate_colorblind:protanopia`):

![Flower image as seen by someone with protanopia](https://res.cloudinary.com/demo/image/upload/e_simulate_colorblind:protanopia/docs/redflower.jpg "thumb: h_150")

### swap_image
&nbsp;`e_swap_image:image_<image ref>[;index_<index>]`

Replaces an image/texture in a 3D model.

{note}This transformation also supports [non-verbose, ordered](./image_transformations#verbose_vs_non_verbose_syntax) syntax.{/note}

**Learn more**: [Changing the texture of a 3D model](./transformations_on_3d_models#changing_the_texture_of_a_3d_model)

#### Syntax details
| Value     | Type    | Description                                                                                                                                                                                                                                |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| image ref | string  | **Required.** A file reference variable specifying the new image to use. Specify either a public ID of an image in your Cloudinary product environment, or use a base64 encoded URL of a remote image with `!fetch:<base64 encoded URL>!`. |
| index     | integer | The index of the image to replace. **Default**: `0`.                                                                                                                                                                                       |

#### Example
Replace the image at index 0 with the  raindrops image that's in the docs folder (`$new_ref:!docs:raindrops!/e_swap_image:image_$new;index_0`):  

![Cloudinary logo with different texture](https://res.cloudinary.com/demo/image/upload/$new_ref:!docs:raindrops!/e_swap_image:image_$new;index_0/dl_10,f_gif,fl_animated/c_fill,h_200,w_400/docs/CldLogo3D)

### theme
&nbsp;`e_theme:color_<bgcolor>[:photosensitivity_<level>]`

Changes the main background color to the one specified, as if a 'theme change' was applied (e.g. dark mode vs light mode). 

{note}This transformation also supports [non-verbose, ordered](./image_transformations#verbose_vs_non_verbose_syntax) syntax.{/note}

**Learn more**: [Theme effect](./effects_and_artistic_enhancements#theme_effect)

#### Syntax details
| Value            | Type    | Description                                                                                                                                                                                                                                     |
| ---------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| color            | string  | **Required.** The target background color. Specify either the name of a color (e.g. `black`, `lightgray`), or an RGB hex value (e.g. `f0ebe6`).                                                                                                 |
| photosensitivity | integer | The sensitivity to photographic elements of an image. A value of 0 treats the whole image as non-photographic.  A value of 200 treats the whole image as photographic, so no theme change is applied.**Range**: `0 to 200`. **Default**: `100`. |

#### Examples
1. Change the screen capture to a dark theme with increased sensitivity to photographic elements (`e_theme:color_black:photosensitivity_110`):
![Dark-themed screen shot](https://res.cloudinary.com/demo/image/upload/e_theme:color_black:photosensitivity_110/docs/cloudinary_website.png "thumb: h_150,dpr_2.0,f_auto,q_auto, height:150")

1. Change the dark-themed code example to one with a light gray background (`e_theme:color_d3d3d3`):
![Light-themed code example](https://res.cloudinary.com/demo/image/upload/e_theme:color_d3d3d3/docs/code_screenshot.png "thumb: h_150,dpr_2.0,f_auto,q_auto, height:150")

### tint
&nbsp;`e_tint[:equalize][:<amount>][:<color1>][:<color1 position>][:<color2>][:<color2 position>][:...][:<color10>][:<color10 position>]`

Blends an image with one or more tint colors at a specified intensity. You can optionally equalize colors before tinting and specify gradient blend positioning per color. 

**Learn more**: [Tint effects](./effects_and_artistic_enhancements#tint)

#### Syntax details
| Value                               | Type    | Description                                                                                                                                      |
| ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| equalize                            | keyword | If `equalize` is specified, the colors are equalized before tinting. Equalize balances out the contrast in the light and dark areas of an image. |
| amount                              | float   | The intensity of the tint colors. **Range**: `0 to 100`. **Default**: `60`.                                                                      |
| color1 to color10                   | string  | The HTML name or the RGB/A hex code of the color (without an `rgb` prefix).  **Default**: `red`.                                                 |
| color1 position to color10 position | string  | The positioning of the gradient blend.**Range**: `0p to 100p`. **Default**: `50p`.                                                               |

#### Example
Tint an image using blue and a lime green (`0f0`) color at a 50% intensity (`e_tint:50:blue:0f0`):

![Horse image with red and blue tint](https://res.cloudinary.com/demo/image/upload/e_tint:50:blue:0f0/horses.jpg "thumb: h_150")

### transition
&nbsp;`e_transition`

A [qualifier](#parameter_types) that applies a custom transition between two concatenated videos.

{info}
This effect has been deprecated. To concatenate videos with transitions use [cross fade transitions](./video_trimming_and_concatenating#cross_fade_transitions).
{/info}

**Use with**: [l\_video](#l_video)

**Learn more**: [Concatenate videos with custom transitions](./video_trimming_and_concatenating#custom_transitions)

#### Example
Apply a transition effect between two concatenated videos (`e_transition,l_video:transition1`):

![Concatenated videos with transition](https://res.cloudinary.com/demo/video/upload/c_fill,h_150/l_video:dog/c_fill,h_150/e_transition,l_video:transition1/fl_layer_apply/fl_layer_apply/kitten_fighting.mp4 "thumb: h_150")

### trim
&nbsp;`e_trim[:<tolerance>][:<color override>]`

Detects and removes image edges whose color is similar to the corner pixels or transparent.

#### Syntax details
| Value          | Type    | Description                                                                                            |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| tolerance      | integer | The level of tolerance for color similarity. **Range**: `0 to 100`. **Default**: `10`.                 |
| color override | string  | The color to trim as a named color or an RGB/A hex code.  **Default**: the color of the corner pixels. |

#### Example
Trim an image, specifying yellow, rather than the red corner pixels, with a tolerance of 50 (`e_trim:50:yellow`):

![Concatenated videos with transition](https://res.cloudinary.com/demo/image/upload/e_trim:50:yellow/docs/casual_yellow_red_corners.png "thumb: h_150")

### unsharp_mask
{actionType:type=image}&nbsp;`e_unsharp_mask[:<strength>]`

Applies an unsharp mask filter to an image.

#### Syntax details
| Value    | Type    | Description                                                             |
| -------- | ------- | ----------------------------------------------------------------------- |
| strength | integer | The strength of the filter. **Range**: `1 to 2000`. **Default**: `100`. |

#### Example
{collapsed}

Apply an unsharp mask filter with a strength of 500 (`e_unsharp_mask:500`):

![Horse image with unsharp filter applied](https://res.cloudinary.com/demo/image/upload/e_unsharp_mask:500/horses.jpg "thumb: h_150")

{/collapsed}

{/actionType}

### upscale
&nbsp;`e_upscale`

Uses AI-based prediction to add fine detail while upscaling small images. 

This 'super-resolution' feature scales each dimension by four, multiplying the total number of pixels by 16.

{tip}
Also consider using other [image enhancement options](./effects_and_artistic_enhancements#image_enhancement_options).
{/tip}
{notes}

* To use the upscale effect, the input image must be smaller than 4.2 megapixels (the equivalent of 2048 x 2048 pixels).
* There is a [special transformation count](./transformation_counts#special_effect_calculations) for the upscale effect.
* The upscale effect isn't supported for [animated](./animated_images) images or [fetched](./fetch_remote_images#fetch_and_deliver_remote_files) images.
* When Cloudinary is generating a derived version, you may get a 423 response returned until the version is ready. You can prepare derived versions in advance using an [eager transformation](./eager_and_incoming_transformations#eager_transformations).
* When Cloudinary is generating an [incoming transformation](./eager_and_incoming_transformations#incoming_transformations), you may get a 420 response returned, with status `pending` until the asset is ready.

{/notes}
**Learn more**: [Upscaling with super resolution](./resizing_and_cropping#upscaling_with_super_resolution)

#### Example
Upscale a 200 x 303 pixel image to 800 x 1212 pixels (`e_upscale`). Click the image to see the full size:

![Upscaled image of a hall](https://res.cloudinary.com/demo/image/upload/e_upscale/docs/tall-hall.jpg "thumb: h_150")

### vectorize
&nbsp;`e_vectorize[:<colors>][:<detail>][:<despeckle>][:<paths>][:<corners>]`

Vectorizes an image. The values can be specified either in an ordered manner according to the above syntax, or by name as shown in the examples below.

{notes}

* To deliver an image as a vector image, make sure to change the format (or URL extension) to a vector format, such as SVG. However, you can also deliver in a raster format if you just want to get the 'vectorized' graphic effect. 
* Large images are scaled down to 1000 pixels in the largest dimension before vectorization.

{/notes}

#### Syntax details
| Value     | Type                 | Description                                                                                                                                                                            |
| --------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| colors    | integer              | The number of colors. <p>**Range**: `2 to 30`. **Default**: `10`.                                                                                                                      |
| detail    | integer &#124; float | The level of detail, either as a percentage of the original image, or an absolute number of pixels. <p>**Range**: `0.0 to 1.0`, or `0 to 1000`. **Default**: `300`.                    |
| despeckle | integer &#124; float | The size up to which to suppress speckles, either as a percentage of the original image, or an absolute number of pixels. <p>**Range**: `0.0 to 1.0`, or `0 to 100`. **Default**: `2`. |
| paths     | integer              | The Bezier curve optimization value up to 100 for least optimization and the largest file. <p>**Range**: `0 to 100`. **Default**: `100`.                                               |
| corners   | integer              | The corner threshold parameter. The lower the value, the smoother the corners. <p>**Range**: `0 to 100`. **Default**: `25`.                                                            |

#### Examples
1. Vectorize an image with 3 colors and a level of detail of 50% (`e_vectorize:3:0.5`):
        ![Vectorized image](https://res.cloudinary.com/demo/image/upload/e_vectorize:3:0.5/woman_sample.svg "thumb: h_150")
1. Vectorize an image with a level of detail of 200 pixels (`e_vectorize:detail:200`):
        ![Vectorized image](https://res.cloudinary.com/demo/image/upload/e_vectorize:detail:200/woman_sample.svg "thumb: h_150")
1. Vectorize an image with all parameters specified (`e_vectorize:colors:15:corners:100:despeckle:0.2:detail:200:paths:90`):
        ![Vectorized image](https://res.cloudinary.com/demo/image/upload/e_vectorize:colors:15:corners:100:despeckle:0.2:detail:200:paths:90/woman_sample.svg "thumb: h_150")

### vibrance
&nbsp;`e_vibrance[:<strength>]`

Applies a vibrance filter to an image.

#### Syntax details
| Value    | Type    | Description                                                                   |
| -------- | ------- | ----------------------------------------------------------------------------- |
| strength | integer | The strength of the vibrance. <p>**Range**: `-100 to 100`. **Default**: `20`. |

#### Example
Apply a vibrance filter to an image with a strength of 70 (`e_vibrance:70`):

![Horse image with vibrance filter applied](https://res.cloudinary.com/demo/image/upload/e_vibrance:70/horses.jpg "thumb: h_150")

### viesus_correct
&nbsp;`e_viesus_correct[:no_redeye][:skin_saturation[_<saturation level>]]`

Requires the [Viesus Automatic Image Enhancement add-on](./viesus_automatic_image_enhancement_addon).<br>
Enhances an image to its best visual quality.

#### Syntax details
| Value                           | Type    | Description                                                                    |
| ------------------------------- | ------- | ------------------------------------------------------------------------------ |
| <small>no_redye</small>         | keyword | Enhances the image without correcting for red eye.                             |
| <small>skin_saturation</small>  | keyword | Enhances the image and also applies saturation to the skin tones in the image. |
| <small>saturation level</small> | integer | The level of skin saturation. <p>**Range**: `-100 to 100`. **Default**: `50`.  |

#### Examples
1. Apply the Viesus add-on to an image (`e_viesus_correct`):
    ![Horse image enhanced to its best visual quality](https://res.cloudinary.com/demo/image/upload/e_viesus_correct/horses.jpg "thumb: h_150")
1. Apply the Viesus add-on, boosting the skin saturation (`e_viesus_correct:skin_saturation_20`):
    ![Woman image enhanced to its best visual quality with skin saturation boost](https://res.cloudinary.com/demo/image/upload/e_viesus_correct:skin_saturation_20/woman_sample "thumb: h_150")

### vignette
&nbsp;`e_vignette[:<level>]`

Applies a vignette effect to an image.

#### Syntax details
| Value | Type    | Description                                                                      |
| ----- | ------- | -------------------------------------------------------------------------------- |
| level | integer | The strength level of the vignette. <p>**Range**: `0 to 100`. **Default**: `20`. |

#### Example
Apply a vignette effect with a level of 30 (`e_vignette:30`):

![Horse image with vignette](https://res.cloudinary.com/demo/image/upload/e_vignette:30/horses.jpg "thumb: h_150")

### volume
&nbsp;`e_volume[:<volume>]`

Increases or decreases the volume on a video or audio file.

#### Syntax details
| Value  | Type                                  | Description                                                                                                                                                                                                                                                                                                                                                        |
| ------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| volume | integer &#124; string &#124; constant | The volume modifier. Specify one of the following:<p><ul><li>Percentage of the original volume.<br>**Range**: `-100 to 400`.</li><li>Increase or decrease in decibels, e.g. `-10dB`.</li><li>`mute`: to mute the sound.</li><li>`auto`: to normalize the audio (only for [sp_auto](./adaptive_bitrate_streaming#normalizing_audio)).</li></ul><p>**Default**: `0`. |

#### Example
Decrease the volume by 50% (`e_volume:50`):

![Parrot video with decreased volume](https://res.cloudinary.com/demo/video/upload/e_volume:-50/docs/parrot.mp4 "thumb: h_250, muted:false")

### zoompan
&nbsp;`e_zoompan[:mode_<mode>][;maxzoom_<max zoom>][;du_<duration>][;fps_<frame rate>][;from_([g_<gravity>][;zoom_<zoom>][;x_<x position>][;y_<y position>])][;to_([g_<gravity>][;zoom_<zoom>][;x_<x position>][;y_<y position>])]`

Also known as the [Ken Burns effect](https://en.wikipedia.org/wiki/Ken_Burns_effect), this transformation applies zooming and/or panning to an image, resulting in a video or animated GIF (depending on the format you specify by either changing the [extension](#_lt_extension_gt) or using the [format](#f_format) parameter). 

You can either specify a mode, which is a predefined type of zoom/pan, or you can provide custom start and end positions for the zoom and pan. You can also use the `gravity` parameter to specify different start and end areas, such as objects, faces, and automatically determined areas of interest. 

{notes}

* The resulting video or animated GIF does not go outside the bounds of the original image. So, if you specify an x,y position of (0,0), for example, the center of the frame will be as close to the top left as possible, but will not be centered on that position.
* The resolution of your image needs to be sufficient for the zoom level that you choose to maintain good quality. 
* To achieve the best visual quality, the output resolution of the resulting video or animated image should be less than or equal to the input image resolution divided by the maximum zoom level. For example, if your original image has a width of 1920 pixels, and your maximum zoom is 3.2, you should display the resulting video at a width of 600 pixels or less (e.g. chain `c_scale,w_600` onto the end of the transformation). 
* If you apply the `zoompan` effect to an animated image, the first frame of the animated image is taken as the input.
* To achieve a smoother zoom, you can increase the frame rate, extend the length of the time over which the zoom occurs, and reduce the difference between zoom levels at the start and end of the transformation.
* The `zoompan` effect won't work if the resulting video exceeds the limits set for your account. As a general rule, use images that don't exceed 5000 x 5000 pixels.
* Currently, you can't use automatic gravity (`g_auto`) in other transformation components that are chained with the `zoompan` effect.

{/notes}

**Learn more**: [The zoompan effect](./effects_and_artistic_enhancements#zoompan) | [Using objects with the zoompan effect](./cloudinary_ai_content_analysis_addon#using_objects_with_the_zoompan_effect)

#### Syntax details
| Value      | Type                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| mode       | constant             | The zoompan mode. Use together with `maxzoom`, but not with `from` or `to`. Specify one of the following:<p><ul><li>`ztc`: Zooms in to the center of the image.</li><li>`ztl`: Zooms in to the left of the image.</li><li>`ztr`: Zooms in to the right of the image.</li><li>`ofc`: Starts at the max zoom at the center and zooms out.</li><li>`ofl`: Starts at the max zoom at the left and zooms out.</li><li>`ofr`: Starts at the max zoom at the right and zooms out.</li><li>`plr`: Starts at the max zoom on the left and moves to the right at the same zoom level.</li><li>`prl`: Starts at the max zoom on the right and moves to the left at the same zoom level.</li></ul></p> |
| max zoom   | float                | The maximum zoom to use together with one of the modes. Use together with `mode`, but not with `from` or `to`. <p>**Range**: `1.1 to 8`. **Default**: `1.4`.</p>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| duration   | float                | The duration of the output video in seconds. <p>**Range**: `1 to 30`. **Default**: `4`.</p>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| frame rate | integer              | The number of frames per second to use in the output video. <p>**Range**: `5 to 60`. **Default**: `25`.</p>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| gravity    | string               | The area of the image to focus on. Specify one of the following:<p><ul><li>`auto` - for the most interesting part of the image</li><li>An [object](./cloudinary_ai_content_analysis_addon#supported_objects_and_categories) (requires the [Cloudinary AI Content Analysis add-on](./cloudinary_ai_content_analysis_addon))</li><li>`auto:` - to focus on an object with some weighting on other interesting parts of the image, falling back to `auto` if the object is not in the picture</li><li>A [compass position](#g_compass_position)</li><li>`face`</li><li>`faces`</li><li>`custom`</li></p>                                                                                      |
| zoom       | float                | The level of zoom for the start or end position. <p>**Range**: `1 to 8`. **Default**: `1`.</p>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| x position | integer &#124; float | The start or end horizontal position. Either specify an integer representing the number of pixels from the left, or a float representing a percentage of the image width (e.g. 0.4 for 40%). <p>**Range**: `0.0 to 1.0` (percentage value), `0 to width of image` (pixel-based value). **Default**: `0.5`.</p>                                                                                                                                                                                                                                                                                                                                                                             |
| y position | integer &#124; float | The start or end vertical position. Either specify an integer representing the number of pixels from the top, or a float representing a percentage of the image height (e.g. 0.4 for 40%).<p>**Range**: `0.0 to 1.0` (percentage value), `0 to height of image` (pixel-based value). **Default**: `0.5`.</p>                                                                                                                                                                                                                                                                                                                                                                               |

{note}
You cannot specify an object as a gravity option if used within a layer, for example, if [concatenating videos](./video_trimming_and_concatenating#concatenate_videos_together).
{/note}

#### Examples
1. Create a five second MP4 video (`.mp4`) from an image of a living room, zooming out from the center, with a maximum zoom of 3.2, and a frame rate of 30 fps (`e_zoompan:mode_ofc;maxzoom_3.2;du_5;fps_30`):
![Living room zooming out from center](https://res.cloudinary.com/demo/image/upload/e_zoompan:mode_ofc;maxzoom_3.2;du_5;fps_30/docs/room.mp4 "with_image:false")
<div style="text-align:center;">
<span style="display:inline-block;vertical-align:top;">
  <video controls muted poster="https://res.cloudinary.com/demo/image/upload/e_zoompan:mode_ofc;maxzoom_3.2;du_5;fps_30/c_scale,h_150/docs/room.jpg" style="margin-right: 10px;display:block;">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:mode_ofc;maxzoom_3.2;du_5;fps_30/c_scale,h_150/docs/room.webm" type="video/webm">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:mode_ofc;maxzoom_3.2;du_5;fps_30/c_scale,h_150/docs/room.mp4" type="video/mp4">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:mode_ofc;maxzoom_3.2;du_5;fps_30/c_scale,h_150/docs/room.ogv" type="video/ogg">
  </video>
  </span>
</div>
2. Create a ten second GIF (`.gif`) from an image of a living room, zooming into the right of the image, with a maximum zoom of 6.5, and using the default frame rate (`e_zoompan:mode_ztr;maxzoom_6.5;du_10`). This also uses the loop effect (`e_loop`):
![Living room zooming into the right](https://res.cloudinary.com/demo/image/upload/e_zoompan:mode_ztr;maxzoom_6.5;du_10/e_loop/docs/room.gif "thumb: h_150")
3. Create an eight second MP4 video (`.mp4`) from a map of the USA, zooming in from a position in the northwest of the USA map (x=300, y=100 pixels), to North Carolina at (x=950, y=400 pixels) (`e_zoompan:from_(zoom_2;x_300;y_100);to_(zoom_4;x_950;y_400);du_8;fps_40`).
![Map of the USA with zoompan effect](https://res.cloudinary.com/demo/image/upload/e_zoompan:from_(zoom_2;x_300;y_100);to_(zoom_4;x_950;y_400);du_8;fps_40/docs/usa_map.mp4 "with_image:false")
<div style="text-align:center;">
<span style="display:inline-block;vertical-align:top;">
  <video controls muted poster="https://res.cloudinary.com/demo/image/upload/e_zoompan:from_(zoom_2;x_300;y_100);to_(zoom_4;x_950;y_400);du_8;fps_40/c_scale,h_150/docs/usa_map.jpg" style="margin-right: 10px;display:block;">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:from_(zoom_2;x_300;y_100);to_(zoom_4;x_950;y_400);du_8;fps_40/c_scale,h_150/docs/usa_map.webm" type="video/webm">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:from_(zoom_2;x_300;y_100);to_(zoom_4;x_950;y_400);du_8;fps_40/c_scale,h_150/docs/usa_map.mp4" type="video/mp4">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:from_(zoom_2;x_300;y_100);to_(zoom_4;x_950;y_400);du_8;fps_40/c_scale,h_150/docs/usa_map.ogv" type="video/ogg">
  </video>
  </span>
</div>
4. Create a four second MP4 video (`.mp4`) of a giraffe, zooming out from the center (`e_zoompan:from_(zoom_8)`). All other parameters are set to default. 
![Giraffe starting fully zoomed in, then zooming out for four seconds](https://res.cloudinary.com/demo/image/upload/e_zoompan:from_(zoom_8)/docs/giraffe.mp4 "with_image:false")
<div style="text-align:center;">
<span style="display:inline-block;vertical-align:top;">
  <video controls muted poster="https://res.cloudinary.com/demo/image/upload/e_zoompan:from_(zoom_8)/c_scale,h_150/docs/giraffe.jpg" style="margin-right: 10px;display:block;">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:from_(zoom_8)/c_scale,h_150/docs/giraffe.webm" type="video/webm">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:from_(zoom_8)/c_scale,h_150/docs/giraffe.mp4" type="video/mp4">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:from_(zoom_8)/c_scale,h_150/docs/giraffe.ogv" type="video/ogg">
  </video>
  </span>
</div>
5. Create a seven second MP4 video (`.mp4`) of a model wearing fashionable items, starting zoomed into the hat (`from_(g_hat;zoom_4.5)`), then zooming out and panning to the pants (`to_(g_pants;zoom_1.6)`).
![Zoom and pan from hat to pants](https://res.cloudinary.com/demo/image/upload/e_zoompan:du_7;from_(g_hat;zoom_4.5);to_(g_pants;zoom_1.6)/c_scale,h_250/q_auto/docs/clothing.mp4 "with_image:false")
<div style="text-align:center;">
<span style="display:inline-block;vertical-align:top;">
  <video controls muted poster="https://res.cloudinary.com/demo/image/upload/c_thumb,h_250,g_hat/docs/clothing.jpg" style="margin-right: 10px;display:block;">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:du_7;from_(g_hat;zoom_4.5);to_(g_pants;zoom_1.6)/c_scale,h_250/q_auto/docs/clothing.webm" type="video/webm">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:du_7;from_(g_hat;zoom_4.5);to_(g_pants;zoom_1.6)/c_scale,h_250/q_auto/docs/clothing.mp4" type="video/mp4">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:du_7;from_(g_hat;zoom_4.5);to_(g_pants;zoom_1.6)/c_scale,h_250/q_auto/docs/clothing.ogv" type="video/ogg">
  </video>
  </span>
</div>
6. Create an MP4 video (`.mp4`) that concatenates a pan from northwest to southeast (`from_(g_north_west;zoom_2.2);to_(g_south_east;zoom_2.2)`) with a pan from northeast to southwest (`from_(g_north_east;zoom_2.2);to_(g_south_west;zoom_2.2)`).
![Zoom and pan from corner to corner](https://res.cloudinary.com/demo/image/upload/e_zoompan:du_5;from_(g_north_west;zoom_2.2);to_(g_south_east;zoom_2.2)/fl_splice,l_docs:clothing/e_zoompan:du_5;from_(g_north_east;zoom_2.2);to_(g_south_west;zoom_2.2)/fl_layer_apply/c_scale,h_250/q_auto/docs/clothing.mp4 "with_image:false")
<div style="text-align:center;">
<span style="display:inline-block;vertical-align:top;">
  <video controls muted poster="https://res.cloudinary.com/demo/image/upload/e_zoompan:du_5;from_(g_north_west;zoom_2.2);to_(g_south_east;zoom_2.2)/fl_splice,l_docs:clothing/e_zoompan:du_5;from_(g_north_east;zoom_2.2);to_(g_south_west;zoom_2.2)/fl_layer_apply/c_scale,h_250/q_auto/docs/clothing.jpg" style="margin-right: 10px;display:block;">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:du_5;from_(g_north_west;zoom_2.2);to_(g_south_east;zoom_2.2)/fl_splice,l_docs:clothing/e_zoompan:du_5;from_(g_north_east;zoom_2.2);to_(g_south_west;zoom_2.2)/fl_layer_apply/c_scale,h_250/q_auto/docs/clothing.webm" type="video/webm">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:du_5;from_(g_north_west;zoom_2.2);to_(g_south_east;zoom_2.2)/fl_splice,l_docs:clothing/e_zoompan:du_5;from_(g_north_east;zoom_2.2);to_(g_south_west;zoom_2.2)/fl_layer_apply/c_scale,h_250/q_auto/docs/clothing.mp4" type="video/mp4">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:du_5;from_(g_north_west;zoom_2.2);to_(g_south_east;zoom_2.2)/fl_splice,l_docs:clothing/e_zoompan:du_5;from_(g_north_east;zoom_2.2);to_(g_south_west;zoom_2.2)/fl_layer_apply/c_scale,h_250/q_auto/docs/clothing.ogv" type="video/ogg">
  </video>
  </span>
</div>
7. Create an MP4 video (`.mp4`) that zooms out from an area of the photo including the house, to the girl `e_zoompan:du_6;from_(g_auto:house;zoom_3.4);to_(g_girl;zoom_1.4)`:
![Zoom and pan from the house to the girl](https://res.cloudinary.com/demo/image/upload/e_zoompan:du_6;from_(g_auto:house;zoom_3.4);to_(g_girl;zoom_1.4)/docs/garden.mp4 "with_image:false")
<div style="text-align:center;">
<span style="display:inline-block;vertical-align:top;">
  <video controls muted poster="https://res.cloudinary.com/demo/image/upload/e_zoompan:du_6;from_(g_auto:house;zoom_3.4);to_(g_girl;zoom_1.4)/c_scale,h_250/q_auto/docs/garden.jpg" style="margin-right: 10px;display:block;">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:du_6;from_(g_auto:house;zoom_3.4);to_(g_girl;zoom_1.4)/c_scale,h_250/q_auto/docs/garden.webm" type="video/webm">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:du_6;from_(g_auto:house;zoom_3.4);to_(g_girl;zoom_1.4)/c_scale,h_250/q_auto/docs/garden.mp4" type="video/mp4">
    <source src="https://res.cloudinary.com/demo/image/upload/e_zoompan:du_6;from_(g_auto:house;zoom_3.4);to_(g_girl;zoom_1.4)/c_scale,h_250/q_auto/docs/garden.ogv" type="video/ogg">
  </video>
  </span>
</div>

## eo (end offset)
&nbsp;`eo_`

Specifies the last second to include in a video (or audio clip). This parameter is often used in conjunction with the [so (start offset)](#so_start_offset) and/or [du (duration)](#du_duration) parameters.

* Can be used independently to **trim** a video (or audio clip) by specifying the last second of the video to include. Everything after that second is trimmed off.
* Can be used as a [qualifier](#parameter_types) to control the timing of a corresponding transformation.

**As a qualifier, use with**: [e\_boomerang](#e_boomerang) | [l\_audio](#l_audio) | [l\_\<image id\>](#l_image_id) | [l\_video](#l_video)

**Learn more**: [Trimming videos](./video_trimming_and_concatenating#trimming_videos) | [Adding image overlays to videos](./video_layers#image_overlays) | [Adding video overlays](./video_layers#video_overlays)

#### Syntax details
| Value      | Type   | Description                                                                                                                                                                                                                                                                                                                        |
| ---------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| time value | number | **Required.** The offset time from the end of the video (or audio clip). <br/>Can be specified as a: <ul><li>float (in seconds)</li><li>a string, representing the time as a percentage of the video, in the format `##p` or `##%`. For example, `75p` represents the frame that is 75% from the beginning of the video </li></ul> |

#### Examples
1. Trim everything after the 10th second from the end of the video (`eo_10.0`):
![Trim a video](https://res.cloudinary.com/demo/video/upload/eo_10.0/docs/campervan-by-lake.mp4 "thumb:ac_none,h_250")
1. Overlay a small version of the `campervan-by-lake` video over the `woman-walking-near-lake-jacket` video, starting from the beginning of the `woman-walking-near-lake-jacket` video (no start offset), and removing the overlay after 8 seconds - the end offset (`eo_8.0`):
![Control the timing of an overlaid video](https://res.cloudinary.com/demo/video/upload/l_video:docs:campervan-by-lake/c_scale,w_0.35,fl_relative/eo_8.0,fl_layer_apply,g_north_east/docs/woman-walking-near-lake-jacket.mp4 "thumb:ac_none,h_250")

## f (format)

&nbsp;

Converts (if necessary) and delivers an asset in the specified format regardless of the file [extension](#_lt_extension_gt) used in the delivery URL. <br/> 

Must be used for automatic format selection ([f_auto](#f_auto)) as well as when [fetching remote assets](./fetch_remote_images#fetch_and_deliver_remote_files), while the file extension for the delivery URL remains the original file extension.

In most other cases, you can optionally use this transformation to change the format as an alternative to changing the file [extension](#_lt_extension_gt) of the public ID in the URL to a supported format. Both will give the same result.

{note}
In SDK **major versions** with initial release earlier than 2020, the name of this parameter is `fetch_format`. These SDKs also have a `format` parameter, which is not a transformation parameter, but is used to change the file extension, as shown in the [file extension examples - #2](#examples_extension). 

The later SDKs have a single `format` parameter (which parallels the behavior of the `fetch_format` parameter of older SDKs). You can use this to change the actual delivered format of any asset, but if you prefer to convert the asset to a different format by changing the extension of the public ID in the generated URL, you can do that in these later SDKs by specifying the desired extension as part of the public ID value, as shown in [file extension examples - #1](#examples_extension).
{/note}

[//]: # ([\<supported format\>](#f_supported_format) | [auto](#f_auto) )

### \<supported format\>
&nbsp;`f_`

Converts and delivers an asset in the specified format. 

#### Optional qualifier
[e_camera](#e_camera)

**Learn more**: [Fetch format](./image_transformations#fetch_format) | [Transcoding videos to other formats](./video_manipulation_and_delivery#transcoding_videos_to_other_formats)

#### Syntax details
| Value            | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| supported format | string | **Required.** The format to use when delivering the asset. <p/>**Possible values**: Any supported delivery format as relevant for the file type you are delivering: <p/><ul><li>[Supported image formats](./image_transformations#supported_image_formats)</li><li>[Supported video formats](./video_manipulation_and_delivery#supported_video_formats)</li><li>[Supported audio formats](./audio_transformations#supported_audio_formats)</li></ul> |

#### Examples
1. Convert and deliver a Photoshop image in JPG format (`f_jpg`):
![image format example](https://res.cloudinary.com/demo/image/upload/f_jpg/docs/cld_record_PSD.psd "height:150")
1. Convert and deliver an MP4 video in WebM format (`f_webm`):
![video format example](https://res.cloudinary.com/demo/video/upload/f_webm/guy_woman_mobile.mp4 "poster:https://res.cloudinary.com/demo/video/upload/h_150/guy_woman_mobile.jpg, thumb: h_150")

### auto
&nbsp;`f_auto[:media type]`

Automatically generates (if needed) and delivers an asset in the optimal format for the requesting browser in order to minimize the file size.

Optionally, include a media type to ensure the asset is delivered with the desired media type when no file extension is included. For example, when delivering a video using `f_auto` and no file extension is provided, the media type will default to an image unless `f_auto:video` is used.

{note}
When used in conjunction with [automatic quality (q_auto)](./image_optimization#automatic_quality_selection_q_auto), sometimes the selected format is not the one that minimizes file size, but rather the format that yields the optimal balance between smaller file size and good visual quality.
{/note}

**Learn more**: [Image automatic format selection](./image_transformations#f_auto) | [Video automatic format selection](./video_manipulation_and_delivery#f_auto)

#### Optional qualifiers
[fl_animated](#fl_animated) | [fl_attachment](#fl_attachment) | [fl_preserve_transparency](#fl_preserve_transparency)

#### Syntax details
| Value      | Type   | Description                                                                                             |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------- |
| media type | string | The media type to use when delivering the asset. <p/>**Possible values**: `image`, `video`, `animated`. |

#### Examples
1. Deliver the `play.jpg` image as a WebP, AVIF or JPEG XL, depending on the browser (or as a regular JPEG to browsers that support none of the aforementioned formats):
![Deliver an image with automatic format selection](https://res.cloudinary.com/demo/image/upload/f_auto/docs/play.jpg "thumb: h_150")
2. Deliver the video as WebM (VP9) to Chrome browsers, MP4 (HEVC) to Safari browsers, or as an MP4 (H.264) to browsers that support neither of the aforementioned formats:
![Deliver a video with automatic format selection](https://res.cloudinary.com/demo/video/upload/f_auto/guy_woman_mobile.mp4 "thumb:ac_none,h_150")
1. Deliver the video with automatic format selection, ensuring it is delivered as a video when no file extension is used: ![Deliver a video with automatic format selection when no file extension provided](https://res.cloudinary.com/demo/video/upload/f_auto:video/guy_woman_mobile "poster:https://res.cloudinary.com/demo/video/upload/h_150/guy_woman_mobile.jpg, thumb:ac_none,h_150")

## fl (flag)
&nbsp;

Alters the regular behavior of another transformation or the overall delivery behavior.

{tip}
You can set multiple flags by separating the individual flags with a dot (`.`).
{/tip}

[//]: # ([alternate](#fl_alternate) | [animated](#fl_animated) | [any_format](#fl_any_format) | [apng](#fl_apng) | [attachment](#fl_attachment) | [awebp](#fl_awebp) | [clip_evenodd](#fl_clip_evenodd) | [clip](#fl_clip) | [cutter](#fl_cutter) | [force_icc](#fl_force_icc) | [force_strip](#fl_force_strip) | [getinfo](#fl_getinfo) | [hlsv3](#fl_hlsv3) | [ignore_aspect_ratio](#fl_ignore_aspect_ratio) | [ignore_mask_channels](#fl_ignore_mask_channels) | [immutable_cache](#fl_immutable_cache) | [keep_attribution](#fl_keep_attribution) | [keep_dar](#fl_keep_dar) | [keep_iptc](#fl_keep_iptc) | [layer_apply](#fl_layer_apply) | [lossy](#fl_lossy) | [mono](#fl_mono) | [no_overflow](#fl_no_overflow) | [no_stream](#fl_no_stream) | [png8 / png24 / png32](#fl_png8_fl_png24_fl_png32) | [preserve_transparency](#fl_preserve_transparency) | [progressive](#fl_progressive) | [rasterize](#fl_rasterize) | [region_relative](#fl_region_relative) | [relative](#fl_relative) | [sanitize](#fl_sanitize) | [splice](#fl_splice) | [streaming_attachment](#fl_streaming_attachment) | [strip_profile](#fl_strip_profile) | [text_disallow_overflow](#fl_text_disallow_overflow) | [text_no_trim](#fl_text_no_trim) | [tiff8_lzw](#fl_tiff8_lzw) | [tiled](#fl_tiled) | [truncate_ts](#fl_truncate_ts) | [waveform](#fl_waveform))

### alternate
&nbsp; `fl_alternate:lang_[;name_<name>]`

Defines an audio layer to be used as an alternate audio track for videos delivered using [automatic streaming profile selection](./adaptive_bitrate_streaming#automatic_streaming_profile_selection). Used to provide multiple audio tracks, for example when you want to provide audio in multiple languages.

**Use with**: [l_audio](#l_audio)

**Learn more**: [Defining alternate audio tracks](./adaptive_bitrate_streaming#defining_alternate_audio_tracks)

#### Syntax details
| Value    | Type   | Description                                                                                                                                                            |
| -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| language | string | The IETF language tag and optional regional tag. For example `lang_en-US`.                                                                                             |
| name     | string | The name for the audio track that will be shown in the player UI. For example `name_Description`. If no name is provided, the name will be inferred from the language. |

{note}
This flag is not currently supported by our SDKs.
{/note}

#### Example
Add an alternate instrumental audio track layer to the `outdoors` video alongside the original audio and deliver using automatic streaming profile selection to add the audio track to the generated manifest (`l_alternate:lang_en;name_Original,l_audio:outdoors/fl_alternate:lang_en;name_Instrumental,l_audio:docs:instrumental-short/sp_auto`).

![multiple audio track example](https://res.cloudinary.com/demo/video/upload/fl_alternate:lang_en;name_Original,l_audio:outdoors/fl_layer_apply/fl_alternate:lang_en;name_Instrumental,l_audio:docs:instrumental-short/fl_layer_apply/sp_auto/outdoors.m3u8 "with_image: false, with_code: false")

<center><iframe src="https://player.cloudinary.com/embed/?public_id=https://res.cloudinary.com/demo/video/upload/fl_alternate:lang_en;name_Original,l_audio:outdoors/fl_layer_apply/fl_alternate:lang_en;name_Instrumental,l_audio:docs:instrumental-short/fl_layer_apply/sp_auto/outdoors.m3u8" width="320" height="180" style="height: auto; width: 50%; aspect-ratio: 640 / 360;" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen frameborder="0"></iframe></center>

### animated
&nbsp; `fl_animated`

Alters the regular video delivery behavior by delivering a video file as an animated image instead of a single frame image, when specifying an image format that supports both still and animated images, such as `webp` or `avif`.  

**Use with**: [fl_apng](#fl_apng) | [fl_awebp](#fl_awebp) | [f_auto](#f_auto)

{note}
When delivering a video and specifying the GIF format (either f_gif or specifying a GIF extension) it's automatically delivered as an animated GIF and this flag is not necessary. To force Cloudinary to [deliver a single frame of a video](./animated_images#deliver_a_single_frame) in GIF format, use the <code>page</code> parameter.
{/note}

**Learn more**: [Converting videos to animated images](./videos_to_animated_images)

#### Example
Generate an animated WebP from the uploaded mp4 video named `guy_woman_mobile`, using a sample of 10 frames from the original video and setting a delay of 100 milliseconds between the frames of the resulting animated WebP (`fl_awebp,fl_animated`):
![Animated WebP created from 10 frames of the video with a delay of 100 milliseconds](https://res.cloudinary.com/demo/video/upload/vs_10,dl_100,w_250,fl_awebp,fl_animated/guy_woman_mobile.webp)

### any_format
&nbsp; `fl_any_format`

Alters the regular behavior of the [q_auto](#q_auto) parameter, allowing it to switch to PNG8 encoding if the automatic quality algorithm decides that's more efficient.

**Use with**: [q_auto](#q_auto)

### apng
&nbsp; `fl_apng`

The `apng` (animated PNG) flag alters the regular PNG delivery behavior by delivering an animated image asset in animated PNG format rather than a still PNG image. Keep in mind that animated PNGs are not supported in all browsers and versions.

**Use with**: [fl_animated](#fl_animated) | [f_png](#f_supported_format) (or when specifying `png` as the delivery URL file extension). 

#### Example
Generate and deliver an animated PNG from the animated GIF file called `spiral_animated` (`fl_apng`):
![Animated PNG created from an animated GIF](https://res.cloudinary.com/demo/image/upload/fl_apng/spiral_animated.png "thumb: h_150")

{note}
Depending on the formats supported by the browser you are currently using, you may or may not see the above image as an animated PNG.
{/note}

### attachment
&nbsp; `fl_attachment[:<filename>]`

Alters the regular delivery URL behavior, causing the URL link to download the (transformed) file as an attachment rather than embedding it in your Web page or application.  

{note}
You can also use this flag with [raw files](./upload_parameters#uploading_non_media_files_as_raw_files) to specify a custom filename for the download. The generated file's extension will match the raw file's original extension.
{/note}

**Use with**: [f_auto](#f_auto)

**See also**: [fl_streaming_attachment](#fl_streaming_attachment)

#### Syntax details
| Value    | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| filename | string | The filename to use for the downloaded attachment. Specify the filename only, without an extension. The file format (and extension) for the download will be the same as it would otherwise have been delivered in. For example, if you use `f_auto` in the same transformation, the format (and corresponding extension) of the downloaded file will be the format that would have been delivered. <p> **Permitted characters**: letter (`A-Z` / `a-z`), number (`0-9`), underscore (`_`), hyphen (`-`),  exclamation mark (`!`) and space. You can include a period (`.`) character in the filename by double-escaping it as: `%252E`.</p> <p>**Default**: The filename the asset had when it was uploaded, unless the [discard_original_filename](./image_upload_api_reference#upload_discard_original_filename) parameter was set during upload. In that scenario only, the `public_id` value is the default download filename. </p> |

#### Example
Deliver an image as a downloadable attachment with a custom filename. (Clicking the URL link below downloads the file instead of opening the image in a new browser window): 

Note that because `f_auto` is used, the downloaded file extension is based on the actual delivered file format and not the extension of the URL. For example, an AVIF file will be delivered if you click this link from Chrome. 

![Image as attachment](https://res.cloudinary.com/demo/image/upload/f_auto/fl_attachment:pretty_flower/docs/flower_shop.jpg "with_image:false") 

### awebp
&nbsp; `fl_awebp`

The `awebp` (animated WebP) flag alters the regular WebP delivery behavior by delivering an animated image or video asset in animated WebP format rather than as a still WebP image. Keep in mind that animated WebPs are not supported in all browsers and versions.

**Use with**: [fl_animated](#fl_animated) | [f_webp](#f_supported_format) (or when specifying `webp` as the delivery URL file extension). 

#### Example
Generate and deliver an animated WebP from the animated GIF file called `kitten_fighting` (`fl_awebp`):
![Animated WebP created from an animated GIF](https://res.cloudinary.com/demo/image/upload/fl_awebp/kitten_fighting.webp "thumb: h_150")

{note}
Depending on the formats supported by the browser you are currently using, you may or may not see the above image as an animated WebP.
{/note}

### c2pa
&nbsp; `fl_c2pa`

Use the `c2pa` flag when delivering images that you want to be signed by Cloudinary for the purposes of C2PA (Coalition for Content Provenance and Authenticity).

**Learn more**: [Content provenance and authenticity](./content_provenance_and_authenticity)

 
#### Example
Add a signature in a new manifest when delivering the `freckles` image (`fl_c2pa`):
![Signed C2PA image](https://res.cloudinary.com/demo/image/upload/c_scale,w_550/fl_c2pa/docs/freckles "with_image:false")

### clip
&nbsp; `fl_clip`

For images with a clipping path saved with the originally uploaded image (e.g. manually created using Photoshop), makes everything outside the clipping path transparent. 

If there are multiple paths stored in the file, you can indicate which clipping path to use by specifying either the path number or name as the value of the page parameter (`pg` in URLs).

**Use with**: [pg (page or file layer)](#pg_page_or_file_layer)

**See also**: [g_clipping_path](#g_clipping_path)

#### Examples
1. Deliver a transparent version of an earrings image, where the non-transparency is based on the second clipping path in the uploaded PSD file (`fl_clip`):
    ![Trim by specified clipping path](https://res.cloudinary.com/demo/image/upload/fl_clip,pg_2/docs/earings_psd_paths.png "thumb: h_150")
2. Deliver a transparent version of an earrings image, where the non-transparency is based on the clipping path named `stones` in the uploaded PSD file:
    ![Trim by specified clipping path](https://res.cloudinary.com/demo/image/upload/fl_clip,pg_name:stones/docs/earings_psd_named_paths.png "thumb: h_150/dpr_2.0, height:150")
3. Deliver a transparent version of a car image, where the non-transparency is based on the clipping path named `front` in the uploaded TIFF file:
    ![Trim by specified clipping path](https://res.cloudinary.com/demo/image/upload/fl_clip,pg_name:front/docs/cp/car_trans.png "thumb: h_150/dpr_2.0, height:150")

### clip_evenodd
&nbsp; `fl_clip_evenodd`

For images with a clipping path saved with the originally uploaded image, makes pixels transparent based on the clipping path using the 'evenodd' clipping rule to determine whether points are inside or outside of the path.

#### Example
Deliver a transparent version of an earrings image using the 'evenodd' clipping rule (`fl_clip_evenodd`):
![Trim by specified clipping path](https://res.cloudinary.com/demo/image/upload/fl_clip_evenodd/docs/earings_psd_paths.png "thumb: h_150/dpr_2.0, height:150")

### cutter
&nbsp; `fl_cutter`

Trims the pixels on the base image according to the transparency levels of a specified overlay image. Where the overlay image is opaque, the original is kept and displayed, and wherever the overlay is transparent, the base image becomes transparent as well. This results in a delivered image displaying the base image content trimmed to the exact shape of the overlay image. 
{note}
The same [layer transformation syntax](./layers#layer_transformation_syntax) rules apply, including for [authenticated or private assets](./layers#authenticated_or_private_layers).
{/note}
**Learn more**: [Shape cutouts: keep a shape](./effects_and_artistic_enhancements#keep_a_shape)

#### Examples
1. Trim a photo based on a hexagon shaped overlay with feathering. The partial transparency of the feathering in the overlay results in a blurred (partial transparency) effect in the trimming (`l_hexagon_feather_sample/fl_cutter`). Prior to applying the overlay, the base image is cropped to match the size of the hexagon overlay, using `g_face` to keep the face in the crop: 
    ![Trim image to feathered hexagon](https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,h_220,w_200/l_hexagon_feather_sample/fl_cutter,fl_layer_apply/face_left.png "thumb: h_150")
2. Trim a (fetched) image of a water drop based on the shape of a text overlay definition  (`l_text:Unkempt_250_bold:Water/fl_cutter`). The text overlay is defined with the desired font and size of the resulting delivered image:
    ![Trim an image based on a text overlay definition](https://res.cloudinary.com/demo/image/fetch/f_png/c_scale,w_800/l_text:Unkempt_250_bold:Water/e_shadow/fl_cutter,fl_layer_apply/https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_%281%29.jpg "thumb: h_120")
3. Transform a picture into an old photograph by using an image of torn paper to trim the picture, and again, as a layer with opacity of 40 to achieved a weathered look:
    ![Torn paper effect](https://res.cloudinary.com/demo/image/upload/c_scale,w_1000/l_torn-paper/c_scale,fl_relative,h_1.0,w_1.0/fl_cutter,fl_layer_apply/l_torn-paper/c_scale,fl_relative,h_1.0,w_1.0/o_40/fl_layer_apply/e_sepia/mac-bubbles.jpg "thumb: h_150")

### draco
&nbsp; `fl_draco`

Optimizes the mesh buffer in glTF 3D models using [Draco compression](https://github.com/google/draco).

**Learn more**: [Applying Draco compression to glTF files](./transformations_on_3d_models#applying_draco_compression_to_gltf_files)

#### Example
Apply Draco compression to a 3D model:
    
![Draco compression](https://res.cloudinary.com/demo/image/upload/fl_draco/DamagedHelmet3D.gltz "with_image:false")

### force_icc
&nbsp; `fl_force_icc`

Adds ICC color space metadata to an image, even when the original image doesn't contain any ICC data.

### force_strip
&nbsp; `fl_force_strip`

Instructs Cloudinary to clear all image metadata (IPTC, Exif and XMP) while applying an [incoming transformation](./eager_and_incoming_transformations#incoming_transformations).

### getinfo
&nbsp; `fl_getinfo`

**For images**: returns information about both the input asset and the transformed output asset in JSON instead of delivering a transformed image.

**For videos**: returns an empty JSON file unless one of the qualifiers below is used.
 
Not applicable to files delivered in certain formats, such as animated GIF, PDF and 3D formats.

As a [qualifier](#parameter_types), returns additional data as detailed below.

**Use with**: 

* [g_auto](#g_auto): 
  * For images, the returned JSON includes the cropping coordinates recommended by the `g_auto` algorithm.
  * For videos, the returned JSON includes the cropping confidence score for the whole video and per second in addition to the horizontal center point of each frame (on a scale of 0 to 1) recommended by the `g_auto` algorithm. 
* [g_\<face-specific-gravity\>](#g_special_position):  For images, the returned JSON includes the coordinates of facial landmarks relative to the top-left corner of the original image.
* [e_preview](#e_preview): For videos, the returned JSON includes an importance histogram for the video.

**Learn more**: 

* [Note on using fl_getinfo with g_auto](./resizing_and_cropping#automatic_cropping_g_auto)
* [Returning the coordinates of facial landmarks](./face_detection_based_transformations#returning_the_coordinates_of_facial_landmarks)
* [Returning video importance histograms](./video_effects_and_enhancements#return_video_importance_histogram) 

#### Examples
1. Return a JSON with the automatically generated `g_auto:subject` cropping coordinates for the specified cropping transformation (`ar_0.7,c_fill,g_auto:subject,w_750/fl_getinfo`):
    ![Return the automatically generated g_auto:subject cropping coordinates](https://res.cloudinary.com/demo/image/upload/ar_0.7,c_fill,g_auto:subject,w_750/fl_getinfo/boat_lake2.jpg "with_image:false")

    Response:

    ```json
    {"input":{"width":1920,"height":1280,"bytes":1213497},"landmarks":[[]],"g_auto_info":[{"x":25,"y":0,"width":893,"height":1279}],"resize":[{"x":23,"y":0,"width":896,"height":1280},{"x_factor":0.8370535714285714,"y_factor":0.8370535714285714}],"output":{"format":"jpg","bytes":308948,"width":750,"height":1071}}
    ```

2. Return a JSON with the facial landmarks in a `plain_face` image by specifying a face-based gravity and a corresponding crop parameter together with `fl_getinfo` (`c_thumb,g_face,w_450/fl_getinfo`):
   ![Return the facial landmarks in the image](https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,w_450/fl_getinfo/docs/plain_face.jpg "with_image:false")

    {tip}
    Click the URL to see the JSON response.
    {/tip}

3. Return a JSON with the importance histogram that Cloudinary would use to generate a video preview of this ImageCon video (`e_preview,fl_getinfo`):
   ![Return e_preview histogram in JSON format](https://res.cloudinary.com/demo/video/upload/e_preview,fl_getinfo/imagecon_grigsby_intro "with_image:false")

    {tip}
    Click the URL to see the JSON response.
    {/tip}

4. Return a JSON with the automatically generated horizontal center points per frame for the specified cropping transformation (`g_auto,ar_1,w_400,c_fill/fl_getinfo`):
   ![Return the automatically generated horizontal center points](https://res.cloudinary.com/demo/video/upload/g_auto,ar_1,w_400,c_fill/fl_getinfo/ship.mp4 "with_image:false")

    {tip}
    Click the URL to see the JSON response.
    {/tip}

### group4
&nbsp; `fl_group4`

Applies **Group 4 compression** to the image. Currently applicable to TIFF files only. If the original image is in color, it is transformed to black and white before the compression is applied.

**Use with**: [f_tiff](#f_supported_format) (or when specifying `tiff` as the delivery URL file extension)

#### Example
Apply Group 4 compression to a TIFF image of an elephant:

![Image of elephant, with group 4 compression](https://res.cloudinary.com/demo/image/upload/fl_group4/docs/elephant-front.tiff "with_image: false")

### hlsv3
&nbsp; `fl_hlsv3`

A [qualifier](#parameter_types) that delivers an HLS adaptive bitrate streaming file as HLS v3 instead of the default version (HLS v4). 

This flag is supported only for product environments with a private CDN configuration.

**Use with**: [sp (streaming profile)](#sp_streaming_profile)

**Learn more**: [Adaptive bitrate streaming](./adaptive_bitrate_streaming)

### ignore_aspect_ratio
&nbsp; `fl_ignore_aspect_ratio`

A [qualifier](#parameter_types) that adjusts the behavior of scale cropping. By default, when only one dimension (width or height) is supplied, the other dimension is automatically calculated to maintain the aspect ratio. When this flag is supplied together with a single dimension, the other dimension keeps its original value, thus distorting an image by scaling in only one direction.

**Use with**: [c_scale](#c_scale)

#### Example
Resize the height of an image to 150 pixels, while retaining the original width (`c_scale,fl_ignore_aspect_ratio,h_150`): 
![Scale in only one direction](https://res.cloudinary.com/demo/image/upload/c_scale,fl_ignore_aspect_ratio,h_150/docs/camera-640.jpg)

### ignore_mask_channels
&nbsp; `fl_ignore_mask_channels`

A [qualifier](#parameter_types) that ensures that an alpha channel is not applied to a TIFF image if it is a mask channel.

**Use with**: [f_tiff](#f_supported_format) (or when specifying `tiff` as the delivery URL file extension)

### immutable_cache
&nbsp; `fl_immutable_cache`

Sets the cache-control for an image to be immutable, which instructs the browser that an image does not have to be revalidated with the server when the page is refreshed, and can be loaded directly from the cache. Currently supported only in Firefox. 

### keep_attribution
&nbsp; `keep_attribution`

Cloudinary's default behavior is to strip almost all metadata from a delivered image when generating new image transformations. Applying this flag alters this default behavior, and keeps all the copyright-related fields while still stripping the rest of the metadata.

**Learn more**: [Default optimizations](./image_optimization#default_optimizations)

**See also**: [fl_keep_iptc](#fl_keep_iptc)

{note}
This flag works well when delivering images in JPG format. It may not always work as expected for other image formats.
{/note}

### keep_dar
{actionType:type=video}&nbsp; `fl_keep_dar`

Keeps the Display Aspect Ratio (DAR) metadata of an originally uploaded video (if it's different from the delivered video dimensions).  

{/actionType}

### keep_iptc
&nbsp; `fl_keep_iptc`

Cloudinary's default behavior is to strip almost all embedded metadata from a delivered image when generating new image transformations. Applying this flag alters this default behavior, and keeps all of an image's embedded metadata in the transformed image.

{note}
This flag cannot be used in conjunction with [q_auto](#q_auto).
{/note}

**Learn more**: [Default optimizations](./image_optimization#default_optimizations)

**See also**: [fl_keep_attribution](#fl_keep_attribution)

#### Example
The following example resizes an image to a width of 400 pixels and keeps all the embedded metadata in a delivered image (`w_400,fl_keep_iptc`). As a result, this delivered image is 94.69 KB. The same transformation without this flag is 68.97 KB:

![Keep embedded metadata on transformation](https://res.cloudinary.com/demo/image/upload/c_scale,w_400/fl_keep_iptc/beach_two_kids.jpg "thumb: h_150")

### layer_apply
&nbsp; `fl_layer_apply`

A [qualifier](#parameter_types) that enables you to apply chained transformations to an overlaid image or video. The first component of the overlay (`l_`) acts as an opening parentheses of the overlay transformation and the `fl_layer_apply` component acts as the ending parentheses. Any transformation components between these two are applied as chained transformations to the overlay and not to the base asset.

This flag is also required when concatenating images to videos or concatenating videos with custom transitions.

**Use with**: [l\_\<image id\>](#l_image_id) | [l\_audio](#l_audio) | [l\_video](#l_video) 

**Learn more**: 

* [Applying multiple transformations to overlays](./layers#multiple_layer_transformations_fl_layer_apply)
* [Concatenate videos with images](./video_trimming_and_concatenating#concatenate_videos_with_images)
* [Concatenate videos with custom transitions](./video_trimming_and_concatenating#custom_transitions)

#### Example
The base image is scaled to a width of 500 pixels before adding an image overlay, where the overlay is automatically cropped to a 150px thumbnail including only the detected face and placed in the top left corner (`c_scale,w_500/l_docs:model/c_thumb,g_face,w_150/fl_layer_apply,g_north_west`):

![Apply a variety of chained transformations to an overlaid image](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/l_docs:model/c_thumb,g_face,w_150/fl_layer_apply,g_north_west/docs/man-rocks-sea.jpg "thumb: h_150")

### lossy
&nbsp; `fl_lossy`

When used with an animated GIF file, instructs Cloudinary to use lossy compression when delivering an animated GIF. By default a quality of 80 is applied when delivering with lossy compression. You can use this flag in conjunction with a specified `q_` to deliver a higher or lower quality level of lossy compression.

When used while delivering a PNG format, instructs Cloudinary to deliver an image in PNG format (as requested) unless there is no transparency channel, in which case, deliver in JPEG format instead.

**Use with**: [f_gif](#f_supported_format) with or without [q_\<quality level\>](#q_quality_level) | [f_png](#f_supported_format) <br/>
(or when specifying `gif` or `png` as the delivery URL file extension)

**Learn more**: [Applying lossy GIF compression](./animated_images#applying_lossy_gif_compression)

#### Example
The original `kitten_fighting` animated GIF has a file size of 6.3 MB without lossy compression. By delivering it with lossy compression and a quality of 50, the file size is reduced to 1.96 MB (33% of its original size) and still has acceptable quality:

![Deliver kitten animated GIF with lossy compression](https://res.cloudinary.com/demo/image/upload/f_gif,fl_lossy/q_50/kitten_fighting.gif "thumb: h_150")

### mono
&nbsp; `fl_mono`

Converts the audio channel in a video or audio file to mono. This can help to optimize your video files if stereo sound is not essential.

#### Example
Deliver the `big_buck_bunny` with mono audio:

![Delivery video with mono audio](https://res.cloudinary.com/demo/video/upload/du_10.0,so_43.0/fl_mono/Big_Buck_Bunny.mp4 "thumb: h_150, muted:false")

### no_overflow
&nbsp; `fl_no_overflow`

A [qualifier](#parameter_types) that prevents an image or text overlay from extending a delivered image canvas beyond the dimensions of the base image

**Use with**: [l_\<image id\>](#l_image_id) | [l_text](#l_text)

**See also**: [fl_text_disallow_overflow](#fl_text_disallow_overflow)

#### Example
In the example below, a base image is scaled down to a width of 400. The logo overlay is larger than the resized image. Without the `fl_no_overflow` flag, a delivered image would increase the size of a delivered image to display the entire overlay. By applying the flag, a transformed image with the overlay is cropped to the dimensions of a resized base image:

![Prevent an overlay from extending the canvas of the base image](https://res.cloudinary.com/demo/image/upload/c_scale,w_400/l_cloudinary_icon_blue/fl_layer_apply,fl_no_overflow/flower.jpg "thumb: h_150")

### no_stream
&nbsp; `fl_no_stream`

Prevents a video that is currently being generated on the fly from beginning to stream until the video is fully generated.

### original
&nbsp; `fl_original`

Delivers the original asset instead of applying the settings enabled in the **Optimize by default** section of the **Optimization** settings.

{notes}

* The use of this flag does not incur a transformation charge.
* The **Optimize by default** settings are available to certain plans only.

{/notes}

**Learn more**: [Optimize by default settings](./optimize_by_default_settings)

### png8 / png24 / png32
&nbsp; `fl_png8` `fl_png24` `fl_png32`

By default, Cloudinary delivers PNGs in PNG-24 format, or if [f_auto](#_auto) and [q_auto](#q_auto) are used, these determine the PNG format that minimizes file size while maximizing quality. In some cases, the algorithm will select PNG-8. By specifying one of these flags when delivering a PNG file, you can override the default Cloudinary behavior and force the requested PNG format.

**See also**: [fl_any_format](#fl_any_format)

### preserve_transparency
&nbsp; `fl_preserve_transparency`

A [qualifier](#parameter_types) that ensures that the [f_auto](#f_auto) parameter will always deliver in a transparent format if the image has a transparency channel.

**Use with**: [f_auto](#f_auto)

### progressive
&nbsp; `fl_progressive[:<mode>]`

Generates a JPG or PNG image using the progressive (interlaced) format. This format allows the browser to quickly show a low-quality rendering of the image until the full quality image is loaded. 

#### Syntax details
| Value | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mode  | constant | Adjusts the rendering of the progressive rendering. <p>**Possible values**: <p><ul><li>`progressive:semi` For JPG images only. Delivers the progressive image using a smart optimization of the decoding time, compression level and progressive rendering (fewer iterations). </li><li>`progressive:steep`: For JPG images only. Delivers a preview very quickly, and in a single later phase, improves the image to the required resolution.</li><li>`progressive:none`: - Do not deliver a progressive image. </li></ul><p>**Default**: <ul><li>If used in conjunction with [q_auto](#q_auto) (or if `q_auto` is set as the default image quality in your [Optimization Settings](https://console.cloudinary.com/app/settings/optimization)): `progressive:semi`</li><li>If used in conjunction with [q_\<quality level\>](#q_quality_level) (or if a specific quality level is set as the default quality in your Settings): `progressive:none`</li></ul> |

### rasterize
&nbsp; `fl_rasterize`

Reduces a vector image to one flat pixelated layer, enabling transformations like PDF resizing and overlays.

### region_relative
&nbsp; `fl_region_relative`

A [qualifier](#parameter_types) that instructs Cloudinary to interpret percentage-based ( e.g. 0.8) width and height values for an image layer (overlay or underlay), as a percentage that is relative to the size of the defined or automatically detected region(s). For example, the region may be the coordinates of an automatically detected face or piece of text, or a custom-defined region.  If an image has multiple regions, then the specified overlay image will be overlaid over each identified region at a size relative to the region it overlays.

**Use with**: [l_\<image id\>](#l_image_id) | [u (underlay)](#u_underlay) <br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AND <br/>
one of the following [special gravities](#g_special_position): `adv_eyes`, `adv_faces`, `custom` `face`, `faces`, `ocr_text`

**Learn more**: 

* [Placing images over detected faces](./face_detection_based_transformations#position_overlays_on_detected_faces)
* [Advanced Facial Attributes Detection Add-on - Placing images over faces and eyes](./advanced_facial_attributes_detection_addon#face_overlays) 
* [OCR Text Detection and Extraction Add-on - Overlaying text with images](./ocr_text_detection_and_extraction_addon#overlaying_detected_text_with_images) 

#### Examples
1. Hide all the faces in an image by covering them with an emoji overlay, where each overlay is sized at 1.3x (130%) of each detected face:
   ![Hide faces in an image with emojis](https://res.cloudinary.com/demo/image/upload/l_happy_smiley/c_scale,fl_region_relative,w_1.3/fl_layer_apply,g_faces/rollercoaster.jpg "thumb: h_150")
2. Place the 'call text' image over each detected text region in the image at 1.1x (110%) of each detected text region. This transformation uses `g_ocr_text`, which triggers the [OCR Text Detection and Extraction Add-on](./ocr_text_detection_and_extraction_addon) to detect the text regions and pass those back to the transformation on the fly:
    ![Overlay an image on all text regions at a relative size](https://res.cloudinary.com/demo/image/upload/l_call_text/c_scale,fl_region_relative,w_1.1/fl_layer_apply,g_ocr_text/home_4_sale.jpg "thumb: h_150")

### relative
&nbsp; `fl_relative`

A [qualifier](#parameter_types) that instructs Cloudinary to interpret percentage-based ( e.g. 0.8) width and height values for an image layer (overlay or underlay), as a percentage that is relative to the size of the base image, rather than relative to the original size of the specified overlay image. This flag enables you to use the same transformation to add an overlay to images that will always resize to a relative size of whatever image it overlays.

**Use with**: [l_\<image id\>](#l_image_id) | [u (underlay)](#u_underlay)

**Learn more**: [Transforming overlays](./layers#layer_transformations)

#### Example
Add a logo overlay to the north-east corner of an image at 30% of the width of the base image:

![Add an overlay that is 30% of the width of the base image](https://res.cloudinary.com/demo/image/upload/l_cloudinary_icon_blue/c_scale,fl_relative,w_0.3/fl_layer_apply,g_north_east/leather_bag_gray.jpg "thumb: h_150")

### replace_image
&nbsp; `fl_replace_image`

A qualifier that takes the image specified as an overlay and uses it to replace the first image embedded in a PDF. 

Transformation parameters that modify the appearance of the overlay (such as effects) can be applied. However, when this flag is used, the overlay image is always scaled exactly to the dimensions of the image it replaces. Therefore, resize transformations applied to the overlay are ignored. For this reason, it is important that the image specified in the overlay matches the aspect ratio of the image in the PDF that it will replace.
{note}
The same [layer transformation syntax](./layers#layer_transformation_syntax) rules apply, including for [authenticated or private assets](./layers#authenticated_or_private_layers).
{/note}
**Use with**: [l_\<image_id\>](#l_image_id)

#### Example
Replace the photo of the woman that appears on the first page of the <a href="https://res.cloudinary.com/demo/image/upload/docs/sample_photos_PDF.pdf" target=_blank>original PDF</a> with a cartoonified version of the `leather_bag` image (`e_cartoonify,fl_replace_image,l_leather_bag`):

![Replace a PDF photo with the overlay photo](https://res.cloudinary.com/demo/image/upload/e_cartoonify,fl_replace_image,l_leather_bag/docs/sample_photos_PDF.pdf "with_image:false")

### sanitize
&nbsp; `fl_sanitize`

Relevant only for the SVG images. Runs a sanitizer on the image.

### splice
&nbsp; `fl_splice[:transition[_([name_<transition name>][;du_<transition duration>])]]`

A [qualifier](#parameter_types) that concatenates (splices) the image, video or audio file specified as an overlay to a base video (instead of placing it as an overlay). By default, the overlay image, video or audio file is spliced to the end of the base video. You can use the [start offset](#so_start_offset) parameter set to `0` (`so_0`) to splice the overlay asset to the beginning of the base video by specifying it alongside `fl_layer_apply`. You can optionally provide a [cross fade transition](./video_trimming_and_concatenating#cross_fade_transitions) between assets.

{note}
Make sure you read the [important notes](./video_trimming_and_concatenating#concatenating_media) regarding concatenating media.
{/note}

**Use with**: [l\_audio](#l_audio) | [l\_video](#l_video) 

**Learn more**: [Concatenating media](./video_trimming_and_concatenating#concatenating_media)

**See also**: [so (start offset)](#so_start_offset)

#### Syntax details
| Value               | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transition name     | string | The name of the cross fade transition to use between assets. <p>**Possible values**: `fade`, `wipeleft`, `wiperight`, `wipeup`, `wipedown`, `slideleft`, `slideright`, `slideup`,`slidedown`, `circlecrop`, `rectcrop`, `distance`, `fadeblack`, `fadewhite`, `radial`, `smoothleft`, `smoothright`, `smoothup`, `smoothdown`, `circleopen`, `circleclose`, `vertopen`, `vertclose`, `horzopen`, `horzclose`, `dissolve`, `pixelize`, `diagtl`, `diagtr`, `diagbl`, `diagbr`, `hlslice`, `hrslice`, `vuslice`, `vdslice`, `hblur`, `fadegrays`, `wipetl`, `wipetr`, `wipebl`, `wipebr`, `squeezeh`, `squeezev`</p><p>**Default**: `fade`</p> |
| transition duration | float  | The time in seconds of the transition. The duration must be less than the length of each of the videos that you are concatenating. <p>**Range**: `0.0` to `60.0`. **Default**: `1.0`.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

#### Examples
1. Splice the video named `fashion_walk` to the end of the video named `meadow_walk` rotated by 20 degrees, with both videos set to a width of 300 pixels and a height of 200 pixels (`du_5,fl_splice,l_video:fashion_walk,so_0/c_fill,h_200,w_300/fl_layer_apply`):
    ![Splice the fashion_walk.mp4 video onto the end of meadow_walk.mp4 rotated by 20 degrees](https://res.cloudinary.com/demo/video/upload/a_20/c_fill,h_200,w_300/du_5,fl_splice,l_video:fashion_walk,so_0/c_fill,h_200,w_300/fl_layer_apply/meadow_walk.mp4 "thumb: h_150")
2. Splice the first 5 seconds of the video named `fashion_walk` on to the beginning of the video named `meadow_walk` rotated by 20 degrees, with both videos set to a width of 300 pixels and a height of 200 pixels (`du_fl_splice,l_video:fashion_walk/c_fill,h_200,w_300/fl_layer_apply,so_0`):
    ![The first 5 seconds of fashion_walk.mp4 spliced to the beginning of meadow_walk.mp4](https://res.cloudinary.com/demo/video/upload/a_20/c_fill,h_200,w_300/du_fl_splice,l_video:fashion_walk/c_fill,h_200,w_300/fl_layer_apply,so_0/meadow_walk.mp4 "thumb: h_150")
3. Splice the first 8 seconds of the video named `kitchen`, and an image named `house-exterior` to the first 7 seconds of the video named `livingspace` using cross fade transitions, `circleopen` for 2.5 seconds (`fl_splice:transition_(name_circleopen;du_2.5)`) and `fade` for one second (the default) (`fl_splice:transition`):
![Cross fade between video of living space and image of house](https://res.cloudinary.com/demo/video/upload/du_7/c_fill,h_150,w_267/fl_splice:transition_(name_circleopen;du_2.5),l_video:docs:kitchen/du_8/c_fill,h_150,w_267/fl_layer_apply/fl_splice:transition,l_docs:house-exterior/du_8/c_fill,h_150,w_267/fl_layer_apply/docs/livingspace.mp4 "thumb: h_150")

### streaming_attachment
&nbsp; `fl_streaming_attachment[:<filename>]`

Like [fl_attachment](#fl_attachment), this flag alters the regular video delivery URL behavior, causing the URL link to download the (transformed) video as an attachment rather than embedding it in your Web page or application.  Additionally, if the video transformation is being requested and generated for the first time, this flag causes the video download to begin immediately, streaming it as a fragmented video file.
(Most standard video players successfully play fragmented video files without issue.)

(In contrast, if the regular `fl_attachment` flag is used, then when a user requests the video transformation for the first time, the download will begin only after the complete transformed video has been generated.)

{note}
HLS (.m3u8) and MPEG-DASH (.mpd) files are by nature non-streamable. If this flag is used with a video in one of those formats, it behaves identically to the regular `fl_attachment` flag.
{/note}

**See also:** [fl_attachment](#fl_attachment)

#### Syntax details
| Value    | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| filename | string | The filename to use for the downloaded attachment. Specify the filename only, without an extension. The file format (and extension) for the download will be the same as it would otherwise have been delivered in. For example, if you use [f_auto](#f_auto) in the same transformation, the format (and corresponding extension) of the downloaded file will be the format that would have been delivered. <p> **Permitted characters**: letter (`A-Z` / `a-z`), number (`0-9`), underscore (`_`), hyphen (`-`),  exclamation mark (`!`) and space. You can include a period (`.`) character in the filename by double-escaping it as: `%252E`.</p> <p>**Default**: The filename the asset had when it was uploaded, unless the [discard_original_filename](./image_upload_api_reference#upload_discard_original_filename) parameter was set during upload. In that scenario only, the `public_id` value is the default download filename. </p> |

#### Example
Deliver a video URL that downloads the transformed video with the filename `shoe-sale` (`fl_streaming_attachment:shoe-sale`).  Because `f_auto` is used in the transformation, the downloaded extension will be the format automatically selected for the browser and device that requests it. For example, in Chrome, the file will probably be downloaded as `shoe-sale.webm`:

![Deliver a video download link with a custom filename](https://res.cloudinary.com/demo/video/upload/c_scale,w_500/f_auto/fl_streaming_attachment:shoe-sale/walking.mp4 "with_image:false")

### strip_profile
&nbsp; `fl_strip_profile`

Converts non-sRGB images to sRGB and then strips the ICC profile data from the delivered image.

### text_disallow_overflow
&nbsp; `fl_text_disallow_overflow`

A [qualifier](#parameter_types) used with text overlays that fails the transformation and returns a 400 (bad request) error if the text (in the requested size and font) exceeds the base image boundaries. This can be useful if the expected text of the overlay and/or the size of the base image isn't known in advance, for example with [user-generated content](./user_generated_content). You can check for this error and if it occurs, let the user who supplied the text know that they should change the font, font size, or number of characters (or alternatively that they should provide a larger base image).

**Use with**: [l_text](#l_text)

**See also**: [fl_no_overflow](#fl_no_overflow) 

#### Example
The requested text overlay (at font size 100) exceeds the requested 400px width of the base flower image. Make sure that in this case, the image transformation isn't generated and a `400` error returns (`co_yellow,fl_text_disallow_overflow,l_text:Arial_100:Big%20Flowers,`): 
![Fail the transformation if a text overlay would extend the canvas of the base image](https://res.cloudinary.com/demo/image/upload/c_scale,w_400/co_yellow,fl_text_disallow_overflow,l_text:Arial_100:Big%20Flowers/fl_layer_apply/flower.jpg "with_image:false")

{tip:title=For comparison:}

* If you deliver the above transformation, but without any flags, the text would extend the overall width of the delivered image to display the text in its entirety. 
* If you deliver the above transformation with the `fl_no_overflow` flag instead of the `fl_text_disallow_overflow` flag, the image would be delivered according to the requested dimensions, and any excess text would be cut off.)
{/tip}

### text_no_trim
&nbsp; `fl_text_no_trim`

A [qualifier](#parameter_types) used with text overlays that adds a small amount of padding around the text overlay string. Without this flag, text overlays are trimmed tightly to the text with no excess padding.

**Use with**: [l_text](#l_text)

### tiff8_lzw
&nbsp; `fl_tiff8_lzw`

A qualifier that generates TIFF images in the TIFF8 format using LZW compression.

**Use with**: [f_tiff](#f_supported_format) (or when specifying `tiff` as the delivery URL file extension)

### tiled
&nbsp; `fl_tiled`

A [qualifier](#parameter_types) that tiles the specified image overlay over the entire image. This can be useful for adding a watermark effect.

**Use with**: [l_\<image id\>](#l_image_id)

**Learn more**: [Automatic tiling](./layers#automatic_tiling)

#### Example
Tile a semi-transparent (opaqueness 30%) logo overlay over the entire image to achieve a watermark effect (`l_cloudinary_icon_white/c_scale,w_200/o_30/fl_layer_apply,fl_tiled`):
![Tile a logo over an image ](https://res.cloudinary.com/demo/image/upload/l_cloudinary_icon_white/c_scale,w_200/o_30/fl_layer_apply,fl_tiled/flower.jpg "thumb: h_150")

### truncate_ts
&nbsp; `fl_truncate_ts`

Truncates (trims) a video file based on the times defined in the video file's metadata (relevant only where the file metadata includes a directive to play only a section of the video).

### waveform
&nbsp; `fl_waveform`

Instead of delivering the audio or video file, generates and delivers a waveform image in the requested image format based on the audio from the audio or video file. by default, the waveform color is white and the background is black. You can customize these using the [co_\<color\>](#co_color) and [b_\<color value\>](#b_color_value)

#### Optional qualifiers
[b_\<color value\>](#b_color_value) | [co_\<color\>](#co_color)

**Learn more**: [Auto-generated waveform images](./audio_transformations#auto_generated_waveform_images)

#### Example
Generate a waveform shape of the audio from the dog video and deliver it as a blue waveform on a grey background in PNG format:

![Generate a waveform image from a video file](https://res.cloudinary.com/demo/video/upload/c_scale,h_200,w_500/b_grey,co_darkblue,fl_waveform/dog.png "thumb: h_150")

## fn (custom function)
&nbsp;`fn_:`

Injects a custom function into the image transformation pipeline. You can use a remote function/lambda as your source, run WebAssembly functions from a compiled **.wasm** file stored in your Cloudinary product environment, deliver assets based on filters using tags and structured metadata, or filter assets returned when generating a client-side list.

**Learn more**: [Custom functions](./custom_functions)

#### Syntax details
| Value         | Type     | Description                                                                                                                                                                                                                           |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| function type | constant | **Required.** The type of function to run. <p>**Possible values**:  `remote`, `select`, `refine`, `render` or `wasm`.                                                                                                                 |
| source        | string   | **Required.** The source of the custom function, either the public ID of the wasm file, the base64 encoded URL of the remote function, the video rendering parameters, the jq filter to use, or the public ID of the JavaScript file. |

#### Example
Inject an uploaded wasm file to quantize an image to use only 5 colors (passed as a [variable](./user_defined_variables#user_defined_variables_overview)) (`$colors_5/fn_wasm:quantize.wasm`):

![Quantize an image with a custom function](https://res.cloudinary.com/demo/image/upload/$colors_5/fn_wasm:quantize.wasm/oldman_village_st.jpg "thumb: h_150")

## fps (FPS)

&nbsp;`fps_[-<maximum frames per second>]`

Controls the FPS (Frames Per Second) of a video or animated image to ensure that the asset (even when optimized) is delivered with an expected FPS level (for video, this helps with sync to audio). Can also be specified as a range.

#### Syntax details
| Value                     | Type    | Description                                                                                                                                                              |
| ------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| frames per second         | integer | **Required.** The frames per second for the video or animated image. If a maximum frames per second value is also given, then this value is regarded as a minimum value. |
| maximum frames per second | integer | The maximum frames per second for the video or animated image.<p>**Default**: `frames per second` value.                                                                 |

#### Examples
1. Set the FPS for a video to between 1 and 5 frames per second (`fps_1-5`):
    ![Set FPS to between 5 and 10 FPS](https://res.cloudinary.com/demo/video/upload/fps_1-5/surfers.mp4 "thumb: h_150")

1. Set the FPS for an animated image to 8 frames per second (`fps_8`):
   ![kitten_fighting with frame rate of 8 FPS](https://res.cloudinary.com/demo/image/upload/fps_8/kitten_fighting.gif "thumb: h_150")

## g (gravity)

&nbsp;

A [qualifier](#parameter_types) that determines which part of an asset to focus on, and thus which part of the asset to keep, when any part of the asset is cropped. For overlays, this setting determines where to place the overlay.

**Learn more**: [Control image gravity](./resizing_and_cropping#control_gravity) | [Control video gravity](./video_resizing_and_cropping#control_gravity)

### \<compass position\>
&nbsp;`g_`

A [qualifier](#parameter_types) that defines a fixed location within an asset to focus on. 

**Use with**: [c_auto - image only](#c_auto) | [c_crop](#c_crop) | [c_fill](#c_fill) | [c_lfill](#c_lfill) | [c_lpad](#c_lpad) | [c_mpad](#c_mpad) | [c_pad](#c_pad) | [c_thumb](#c_thumb) | [l_\<image id\>](#l_image_id) | [l_fetch](#l_fetch) | [l_text](#l_text) | [l_subtitles](#l_subtitles) | [l_video](#l_video) | [u_\<image id\>](#u_image_id) | [u_fetch](#u_fetch) | [x, y (x & y coordinates)](#x_y_coordinates)

#### Syntax details
| Value            | Type     | Description                                                                                                                                                                                                                                                                               |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| compass position | constant | **Required.** The compass direction represents a location in the asset, for example, north_east represents the top right corner.<p>**Possible values**: `north_east`, `north`, `north_west`, `west`, `south_west`, `south`, `south_east`, `east`, or `center`.  <p>**Default**: `center`. |

#### Example
Crop an image to a width of 200 pixels, a height of 150 pixels, with south gravity (`c_crop,g_south,h_150,w_200`):

![Image cropped to 100x150 with south gravity](https://res.cloudinary.com/demo/image/upload/c_crop,g_south,h_150,w_200/docs/flower_shop.jpg)

### \<special position\>
&nbsp;`g_`

A [qualifier](#parameter_types) that defines a special position within the asset to focus on.

{note}
The only special position that is supported for [animated images](./animated_images) is `custom`. If other positions are specified in an animated image transformation, `center` gravity is applied. 
{/note}

**Use with**: [c_auto](#c_auto) | [c_crop](#c_crop) | [c_fill](#c_fill) | [c_lfill](#c_lfill) | [c_scale](#c_scale) (for `g_liquid` only) | [c_thumb](#c_thumb) | [e\_pixelate\_region](#e_pixelate_region) | [l_\<image id\>](#l_image_id) | [l_fetch](#l_fetch) | [l_text](#l_text)  | [u_\<image id\>](#u_image_id) | [u_fetch](#u_fetch) | [x, y (x & y coordinates)](#x_y_coordinates)

**See also**: [fl_getinfo](#fl_getinfo) 

#### Syntax details
| Value            | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| special position | constant | **Required.** The position to focus on.<p>**Note**: The fallback (default) values mentioned below are only relevant when setting gravity for [cropping modes](#c_crop_resize) and not when setting gravity for [placing overlays](#l_layer). For example, if gravity is set to 'face' for placing an overlay, and no face is detected in the image, then the overlay is ignored.<p>One of the following special positions:<ul><li>`adv_eyes` - Automatically detect all eyes in an image with the [Advanced Facial Attribute Detection add-on](./advanced_facial_attributes_detection_addon#eyes_detection_based_cropping) and make them the focus of the transformation.</li><li>`adv_face` - Automatically detect the largest face in an image with the [Advanced Facial Attribute Detection add-on](./advanced_facial_attributes_detection_addon#face_detection_based_cropping) and make it the focus of the transformation.</li><li>`adv_faces` - Automatically detect all faces in an image with the [Advanced Facial Attribute Detection add-on](./advanced_facial_attributes_detection_addon#face_detection_based_cropping) and make them the focus of the transformation.</li><li>`cld-decompose_tile` - For use on images that are composed of several images (effectively tiled), automatically detect the composite tiles of the image and make the largest tile the focus of the crop (see [example](#examples_g_special_position_tile)).</li><li>`custom` - Use [custom coordinates](./custom_focus_areas#custom_coordinates) that were previously specified (e.g., as part of the image [upload method](./image_upload_api_reference#upload)) and make them the focus of the transformation. Uses the largest of the areas defined if more than one set of coordinates is defined. Defaults to `center` gravity if no custom coordinates have been specified.</li><li> `custom:face` - Same as `custom` gravity, but defaults to `face` gravity if no custom coordinates have been specified.</li><li>`custom:adv_face` - Same as `custom` gravity, but defaults to `adv_face` gravity if no custom coordinates have been specified.</li><li>`custom:adv_faces` -  Same as `custom` gravity, but defaults to `adv_faces` gravity if no custom coordinates have been specified.</li><li>`custom:faces` - Same as `custom` gravity, but defaults to `faces` gravity if no custom coordinates have been specified.</li><li>`face` - Automatically detect the largest [face](./face_detection_based_transformations#face_detection_based_cropping) in an image and make it the focus of the transformation. Any previously specified face coordinates (during [upload](./image_upload_api_reference#upload), with the [Admin API](./admin_api#update_details_of_an_existing_resource), or via the [Cloudinary Console](https://console.cloudinary.com/console)) override the automatically detected faces and are used instead. Defaults to `north` gravity if no face is detected or previously specified. You can also use `face:auto` or `face:center` so that the gravity will default to [auto](#g_auto) or `center` if no [face](./face_detection_based_transformations#face_detection_based_cropping) is detected or specified.</li><li>`face:center` - Same as `face` gravity, but defaults to `center` gravity if no face is detected.</li><li>`faces` - Same as `face` gravity, but detects all the [faces](./face_detection_based_transformations#face_detection_based_cropping) in an image and uses the rectangle containing all face coordinates as the basis of the transformation. Any previously specified face coordinates (during [upload](./image_upload_api_reference#upload), with the [Admin API](./admin_api#update_details_of_an_existing_resource), or via the [Cloudinary Console](https://console.cloudinary.com/console)) override the automatically detected faces and are used instead. Defaults to `north` gravity if no faces are detected or previously specified. You can also use `faces:auto` or `faces:center` so that the gravity will default to [auto](#g_auto) or `center` if no faces are detected or specified.</li><li>`faces:center` - Same as `faces` gravity, but defaults to `center` gravity if no [face](./face_detection_based_transformations#face_detection_based_cropping) is detected.<li>`liquid` - uses content-aware [liquid rescaling](./resizing_and_cropping#liquid_rescaling) to remove 'seams' of pixels that may zig zag horizontally or vertically through the picture. Must be used with [c_scale](#c_scale).</li><li>`ocr_text` - Detect all text elements in an image using the [OCR Text Detection and Extraction add-on](./ocr_text_detection_and_extraction_addon) and use the detected bounding box coordinates as the basis of the transformation.</li><li>`xy_center` - Set the center of gravity to the given `x` & `y` coordinates.</ul> |

#### Examples
1. Crop an image to 150x150 while focusing on the largest face in the image (`c_crop,g_face,h_150,w_150`):
    ![Crop to 150x150 with face gravity](https://res.cloudinary.com/demo/image/upload/c_crop,g_face,h_150,w_150/couple.jpg)
2. <a class="anchor" name="examples_g_special_position_tile"></a> Crop a <a href="https://res.cloudinary.com/demo/image/upload/docs/tiled-birds.jpg" target="_blank">composite image</a>, keeping only the largest tile (`c_crop,g_cld-decompose_tile`):
    ![Crop to the largest tile](https://res.cloudinary.com/demo/image/upload/c_crop,g_cld-decompose_tile/docs/tiled-birds.jpg "thumb: h_150")

### \<object\>
&nbsp;`g_`

Requires the [Cloudinary AI Content Analysis add-on](./cloudinary_ai_content_analysis_addon).<br>
A [qualifier](#parameter_types) for [cropping](#c_crop) an image to automatically crop around objects without needing to specify dimensions or an aspect ratio.

{note}
Object gravity is not supported for [animated images](./animated_images). If `g_` is used in an animated image transformation, `center` gravity is applied. 
{/note}

**Use with**: [c_auto](#c_auto) | [c_crop](#c_crop) | [c_fill](#c_fill) | [c_lfill](#c_lfill) | [c_thumb](#c_thumb)

**Learn more**: [Cloudinary AI Content Analysis add-on](./cloudinary_ai_content_analysis_addon)

#### Syntax details
| Value  | Type     | Description                                                                                                                                                                                                              |
| ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| object | constant | A specified object or category. <p>**Possible values**: One or more [supported objects or categories](./cloudinary_ai_content_analysis_addon#supported_objects_and_categories), separated by colons (e.g.: `shoe:boot`). |

#### Example
Crop this <a href="https://res.cloudinary.com/demo/image/upload/docs/kitchen1.jpg" target=_blank>large image of a kitchen</a> exactly to the coordinates of the detected microwave (`c_crop,g_microwave`):

![Cropping tightly around a microwave](https://res.cloudinary.com/demo/image/upload/c_crop,g_microwave/docs/kitchen1.jpg "thumb: h_150")

### auto
&nbsp;`g_auto[:<algorithm>][:<focal gravity>][:<thumb aggressiveness>][:thirds_0]`

A [qualifier](#parameter_types) to automatically identify the most interesting regions in the asset, and include in the crop.

{notes}

* Automatic gravity is not supported for [animated images](./animated_images). If `g_auto` is used in an animated image transformation, `center` gravity is applied, except when `c_fill_pad` is also specified, in which case an error is returned.  
* Any [custom coordinates](./custom_focus_areas#custom_coordinates) defined for a specific image will override the automatic cropping algorithm and only the custom coordinates will be used 'as is' for the gravity, unless you specify 'custom\_no\_override' or 'none' as the **focal_gravity**.
* If you're using our [Asia Pacific data center](./admin_api#alternative_data_centers_and_endpoints_premium_feature), you currently can't apply `g_auto` to videos.
  
{/notes}

**Use with**: [c_auto - image only](#c_auto) | [c_auto_pad - image only](#c_auto_pad) | [c_crop - image only](#c_crop) | [c_fill](#c_fill) | [c_fill_pad](#c_fill_pad) | [c_lfill - image only](#c_lfill) | [c_thumb - image only](#c_thumb) 

**Learn more**: [Automatic image cropping](./resizing_and_cropping#automatic_cropping_g_auto) | [Automatic video cropping](./video_resizing_and_cropping#automatic_gravity_for_crops_g_auto)

**See also**: [fl_getinfo](#fl_getinfo)

#### Syntax details
| Value                               | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| algorithm<br/>                      | constant | **Image only**. The algorithm to apply:<p><ul><li>`subject`: Applies deep-learning algorithms to identify the subjects of an image that are most likely to attract a person's gaze.</li><li>`classic`: Uses a combination of saliency heuristics to automatically detect significant regions in the image.</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| focal gravity                       | constant | Controls which elements are given higher priority for inclusion by the cropping algorithm.  <p>**Images**</p> This value can be:<ul><li>One of the focal gravity options as specified for [special positions](#g_special_position) (e.g.: `face`).</li><li>`aoi_` - an area of interest specified by custom coordinates of the form `___`. This overrides any custom coordinates already specified for an image (using the [Upload API](./image_upload_api_reference) or the [Cloudinary Console](https://console.cloudinary.com/console)) (see [Custom coordinates on the fly](./custom_focus_areas#custom_coordinates_on_the_fly)). </li><li>A specified object or category. You can specify one or more [supported objects or categories](./cloudinary_ai_content_analysis_addon#supported_objects_and_categories), separated by colons (e.g.: `shoe:boot`). You can also specify the generic `g_auto:object` value to give priority to any detected object in the image. To use this option, you must be registered to the [Cloudinary AI Content Analysis](./cloudinary_ai_content_analysis_addon) add-on.</li></ul><p>Appending `_avoid` to the focal gravity minimizes the likelihood of including the specified [object](./cloudinary_ai_content_analysis_addon#specifying_objects_to_avoid_using_auto_gravity)/[face](./face_detection_based_transformations#position_overlays_avoiding_detected_faces)/[text](./ocr_text_detection_and_extraction_addon#avoiding_text) in the crop.</p>**Default:** `faces`. <hr> **Videos** <p>Possible values:</p> <ul><li>`face`: Focuses the crop on the largest face detected in the video.</li><li>`faces`: Focuses the crop on all the detected faces in the video.</li><li>A specified object or category (see [Adjusting the automatic gravity focal preference for objects](./video_resizing_and_cropping#auto_cropping_videos_to_focus_on_a_specified_object)). </li></ul> **Default**: `null` (gaze prediction algorithm is used). |
| <small>thumb aggressiveness</small> | integer  | **Image only**. Relevant only for 'thumb' cropping. The level of aggressiveness of the thumb cropping algorithm between 0 and 100. 100 keeps more of the original image. 0 crops more aggressively and zooms in.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| thirds_0                            | constant | **Image only**. Specify `thirds_0` to disable the [rule of thirds](./resizing_and_cropping#the_rule_of_thirds) principle, resulting in the important elements being more centered, rather than offset according to the principle.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

#### Examples
1. Use the fill cropping mode to display a video in a square aspect ratio whilst keeping the dog as the main focus throughout (`ar_1:1,c_fill,g_auto,w_400`):

    ![Auto cropping to 1:1 aspect ratio](https://res.cloudinary.com/demo/video/upload/ar_1:1,c_fill,g_auto,w_400/dog_orig_qflwce.mp4 "thumb: h_150")

1. Automatically crop an image to a square aspect ratio, based on the areas most likely to attract a person's initial gaze. (`ar_1:1,c_fill,g_auto:subject`):

    ![Auto cropping to 1:1 aspect ratio](https://res.cloudinary.com/demo/image/upload/ar_1:1,c_fill,g_auto:subject/boat_lake2.jpg "thumb: h_150")

1. Automatically crop an image to a square aspect ratio while focusing on a cat in the image (`ar_1:1,c_crop,g_auto:cat,w_1000`):

    ![Auto cropping a cat](https://res.cloudinary.com/demo/image/upload/ar_1:1,c_crop,g_auto:cat,w_1000/docs/one_cat_one_dog.jpg "thumb: h_150")

1. Automatically crop an image using custom coordinates to specify the area of interest to keep (`g_auto:aoi_420_230_330_160`):

    ![Auto cropping with custom coordinates](https://res.cloudinary.com/demo/image/upload/c_crop,g_auto:aoi_420_230_330_160,h_200,w_400/docs/addons/objectdetection/automobile-1853936_1920.jpg "thumb: h_150")

### clipping_path
&nbsp;`g_clipping_path_!!`

A [qualifier](#parameter_types) to specify a named clipping path in the image to focus on when cropping an image. Works on file formats that can contain clipping paths such as TIFF.

{note}
Clipping paths work when the original image is 64 megapixels or less. Above that limit, the clipping paths are ignored.
{/note}

**Use with**: [c_auto](#c_auto) | [c_crop](#c_crop) | [c_fill](#c_fill) | [c_lfill](#c_lfill) | [c_lpad](#c_lpad) | [c_mpad](#c_mpad) | [c_pad](#c_pad) | [c_thumb](#c_thumb) 

[//]: # (| [l_\<image id\>](#l_image_id) | [l_fetch](#l_fetch) | [l_text](#l_text) | [u (underlay)](#u_underlay))

**See also**: [fl_clip](#fl_clip)

#### Syntax details
| Value              | Type   | Description                                             |
| ------------------ | ------ | ------------------------------------------------------- |
| Clipping path name | string | **Required.** The name of a clipping path in the image. |

#### Examples
1. Crop the `cld_sample_clipping_paths` TIFF file around the area of the image containing the clipping path named `vinyl` (`c_crop,g_clipping_path_!vinyl!`):
    ![Crop the image focusing on the clipping path named vinyl](https://res.cloudinary.com/demo/image/upload/c_crop,g_clipping_path_!vinyl!/docs/cld_sample_clipping_paths.png "thumb:c_scale,h_150, height:150")

2. Use the `fill` cropping mode to crop the `cld_sample_clipping_paths` TIFF file focusing on the area of the image containing the clipping path named `vinyl` (`ar_1:2,c_fill,g_clipping_path_!vinyl!`):
    ![Crop the image focusing on the clipping path named vinyl](https://res.cloudinary.com/demo/image/upload/ar_1:2,c_fill,g_clipping_path_!vinyl!/docs/cld_sample_clipping_paths.png "thumb:c_scale,h_150, height:150")

3. Crop the transparent `car_trans` TIFF file around the area of the image containing the clipping path named `front` (`c_crop,g_clipping_path_!front!`):
    ![Crop the image focusing on the clipping path named front](https://res.cloudinary.com/demo/image/upload/c_crop,g_clipping_path_!front!/docs/cp/car_trans.png "thumb:c_scale,h_150, height:150")

    {note}
    This is different than using `fl_clip,pg_name:front`, as the dimensions of the image are cropped to the clipping path, rather than maintaining the size of the original image.
    {/note}

### region
&nbsp;`g_region_!!`

[//]: # ({actionType:type=image}&nbsp;`g_region_!![;...;!<region name n>!]`)

A [qualifier](#parameter_types) to specify a named custom region in the image to focus on.

{notes}

* You can set named custom regions using the `regions` parameter of the [upload](./image_upload_api_reference#regions_upload), [explicit](./image_upload_api_reference#regions_explicit) or [update](./admin_api#regions) methods. 
* You can see the coordinates of named regions in images: 
  * Using the [list delivery type](./list_assets#client_side_asset_lists). Apply a tag to the image and use the syntax, `https://res.cloudinary.com//image/list/.json`
  * In the response to a [request for details of a resource](./admin_api#get_details_of_a_single_resource_by_public_id), for example:
  
  ```json
    "regions": [
    {
        "name": "hat",
        "values": [
        [2720, 770],
        [3700, 1920]
        ]
    },
    {
        "name": "shoes",
        "values": [
        [3200, 6200],
        [4900, 8140]
        ]
    }
    ],
  ```

{/notes}

**Use with**: [c_auto](#c_auto) | [c_crop](#c_crop) | [c_fill](#c_fill) | [c_lfill](#c_lfill) | [c_lpad](#c_lpad) | [c_mpad](#c_mpad) | [c_pad](#c_pad) | [c_thumb](#c_thumb) 

[//]: # (| [l_\<image id\>](#l_image_id) | [l_fetch](#l_fetch) | [l_text](#l_text) | [u (underlay)](#u_underlay))

**Learn more**: [Custom regions](./custom_focus_areas#custom_regions)

#### Syntax details
| Value       | Type   | Description                                                                                                                                                                                                                                                                                                                                 |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| region name | string | **Required.** A named location in the image as specified previously in the `regions` parameter in the [upload method](./image_upload_api_reference#regions_upload), the [explicit method](./image_upload_api_reference#regions_explicit) or in the [update method](./admin_api#regions). Alphanumeric characters and hyphens are permitted. |

[//]: # (region name 1 to n | string | **Required.** A named location in the image as specified previously in the `regions` parameter in the [upload method](./image_upload_api_reference#upload), the [explicit method](./image_upload_api_reference#explicit) or in the [update method](./admin_api#update_details_of_an_existing_resource). If more than one region name is given, the regions are combined into one larger region, using a bounding box that covers them all.)

#### Example
Create a thumbnail of an image 150 pixels square while focusing on the region defined as `shoes` in a previous upload request (`c_auto,g_region_!shoes!,h_150,w_150`):
    ![Crop to 150x150 focusing on the region named shoes](https://res.cloudinary.com/demo/image/upload/c_auto,g_region_!shoes!,h_150,w_150/docs/cr/clothing.jpg)

[//]: # (2. Crop an image to 150 x 300 pixels while focusing on the combined regions defined as `shoes` and `hat` in a previous explicit request (`c_crop,g_region_!shoes!;!hat!`):)
 [//]: # (       ![Crop to 300x150 focusing on the sweet and coffee regions](https://res.cloudinary.com/demo/image/upload/c_crop,g_region_!shoes!;!hat!,h_300,w_150/docs/cr/clothing.jpg))

### track_person
{actionType:type=video}&nbsp;`g_track_person[:obj_<object>][;position_<position>][;adaptivesize_<size>]`

A [qualifier](#parameter_types) to add an image or text layer that tracks the position of a person throughout a video. Can be used with fashion object detection to conditionally add the layer based on the presence of a specified object.

> **NOTES**:
>
> * Only one tracked layer can be applied at a time.

> * The maximum video duration that tracked layers can be applied to is 3 minutes.

> * When requesting your video on the fly, you will receive a 423 response until the video has been processed. Once processed, subsequent transformations will be applied synchronously.

> * You can apply transformations to the layer, such as controlling duration, by adding those into the layer definition component (e.g. `l_price_tag,du_3`)

> * If you're using our [Asia Pacific or Europe data centers](./admin_api#alternative_data_centers_and_endpoints_premium_feature), you currently can't apply `g_track_person` to videos.

**Use with**: [l_\<image id\>](#l_image_id) | [l_fetch](#l_fetch) | [l_text](#l_text) | [u_\<image id\>](#u_image_id) | [u_fetch](#u_fetch)

#### Syntax details
| Value        | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| object       | string  | The name of an object to detect on the person or people in the video. The presence of the object on the person is used to determine whether to display the layer. Detected objects use the `cld-fashion` model and require the [Cloudinary AI Content Analysis add on](./cloudinary_ai_content_analysis_addon). For a full list of available objects, see the [supported objects table](./cloudinary_ai_content_analysis_addon#supported_objects_and_categories). |
| position     | string  | The position of the layer relative to the detected person. **Possible values**: `center`, `n`, `e` (default), `s`, `w`, `ne`, `nw`, `se`, `sw`.                                                                                                                                                                                                                                                                                                                   |
| adaptivesize | integer | The size of the layer relative to the size of the person for each frame of the video. Size is defined as a number between 0-100 representing the percentage relative to the person.                                                                                                                                                                                                                                                                               |

#### Example
{collapsed}

Add a price tag overlay that tracks the people in the video based on detecting a dress, positions it above and adapts the size to maintain 50% sizing compared to the people (`l_price_tag/g_track_person:obj_dress;position_n;adaptivesize_50,fl_layer_apply`):
    ![Adding a layer that tracks people wearing dresses](https://res.cloudinary.com/demo/video/upload/l_price_tag/g_track_person:obj_dress;position_n;adaptivesize_50,fl_layer_apply/dresses.mp4 "width: 300, with_code: false, poster: https://res.cloudinary.com/demo/video/upload/dresses.jpg")

{/collapsed}

{/actionType}

## h (height) 
&nbsp;`h_<height value>`

A [qualifier](#parameter_types) that determines the height of a transformed asset or an overlay.

**Use with**: [c (crop/resize)](#c_crop_resize) | [l (layer)](#l_layer) | [e\_blur\_region](#e_blur_region) | [e\_pixelate\_region](#e_pixelate_region) | [u (underlay)](#u_underlay)

**Learn more**: [Resizing and cropping images](./resizing_and_cropping) | [Placing layers on images](./layers) | [Placing layers on videos](./video_layers)

**See also**: [w (width)](#w_width) | [ar (aspect ratio)](#ar_aspect_ratio) | [Arithmetic expressions](./user_defined_variables#arithmetic_expressions)

#### Syntax details
| Value        | Type                                 | Description                                                                                                                                                                                                                                                                                                                                                             |
| ------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| height value | integer &#124; float &#124; constant | **Required.** The height of the asset. Set to:An **integer** value to set the height to the given number in pixels (e.g., `150` sets the height to exactly 150 pixels).A **decimal** value to set the height to a multiple of the original dimension (e.g., `0.5` sets the height to half the original width).`ih` to specify the initial height of the original image. |

#### Examples
1. Resize the image to a height of 150 pixels while maintaining aspect ratio (`c_scale,h_150`):

    ![Resize to a height of 150](https://res.cloudinary.com/demo/image/upload/c_scale,h_150/face_top.jpg)

1. Resize the image to 30% of its original size (`c_scale,h_0.3`):

    ![Resize to 30% of original height](https://res.cloudinary.com/demo/image/upload/c_scale,h_0.3/docs/flower_shop.jpg "thumb: h_150")

## if (if condition)
&nbsp;`if_[<directive>][_<asset characteristic>_<operator>_<asset characteristic value>]`

Applies a transformation only if a specified condition is met.

**Learn more**: [Conditional image transformations](./conditional_transformations) | [Conditional video transformations](./video_conditional_expressions)

**See also**: [Arithmetic expressions](./user_defined_variables#arithmetic_expressions)

#### Syntax details
| Value                      | Type                 | Description                                                                                                                                                                                                                                            |
| -------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| asset characteristic       | constant             | **Required.** The parameter representing the [image characteristic](./conditional_transformations#supported_image_characteristics) or [video characteristic](./video_conditional_expressions#supported_video_characteristics) to evaluate (e.g., `w`). |
| operator                   | constant             | **Required.** The comparison [operator](./conditional_transformations#supported_operators) for the comparison (e.g., `lt` for 'less than').                                                                                                            |
| asset characteristic value | number &#124; string | **Required.** A hard coded value of the characteristic or a different characteristic (e.g., `300`).                                                                                                                                                    |
| directive                  | constant             | **Possible values**: `else`: Specifies an [else branch transformation](./conditional_transformations#else_branch_transformations).`end`: Specifies the end of an `if` condition.                                                                       |

#### Examples
1. Apply an oil painting effect if the width is greater than 300 pixels (`if_w_gt_300/e_oil_paint/if_end`):

    ![Apply an oil painting effect if the width is greater than 300 pixels](https://res.cloudinary.com/demo/image/upload/if_w_gt_300/e_oil_paint/if_end/docs/camera-640.jpg "thumb: h_150")

1. Add a sale icon to a product image if both the strings 'sale' and 'in_stock' are among the tags assigned to the image (`if_!sale:in_stock!_in_tags/l_sale_icon/c_scale,w_180/fl_layer_apply,g_south_east,x_30,y_30/if_end`):

    ![](https://res.cloudinary.com/demo/image/upload/if_!sale:in_stock!_in_tags/l_sale_icon/c_scale,w_180/fl_layer_apply,g_south_east,x_30,y_30/if_end/backpack.jpg "thumb: h_150")

1. Apply a condition if the width is less than or equal to 400 pixels then fill the image to 220x180 and add a red effect, else if the width is greater than 400 pixels then fill the image to 190x300 and add an oil painting effect (`if_w_lte_400/c_fill,h_220,w_180/e_red/if_else/c_fill,h_190,w_300/e_oil_paint/if_end`):

    ![](https://res.cloudinary.com/demo/image/upload/if_w_lte_400/c_fill,h_220,w_180/e_red/if_else/c_fill,h_190,w_300/e_oil_paint/if_end/alfa_car.jpg "thumb: h_150")

## ki (keyframe interval)

&nbsp;`ki_<interval value>`

Explicitly sets the keyframe interval of the delivered video.

#### Syntax details
| Value          | Type  | Description                                                                                                  |
| -------------- | ----- | ------------------------------------------------------------------------------------------------------------ |
| interval value | float | **Required.** A positive decimal value representing the interval between keyframes in seconds (e.g., `0.1`). |

#### Example
Set the time between keyframes to every 0.15 seconds (`ki_0.15`):

![Set keyframe interval to every 0.15 seconds](https://res.cloudinary.com/demo/video/upload/ki_0.15/guy_woman_mobile "thumb: h_150")

## l (layer)

&nbsp;

Applies a layer over the base asset, also known as an **overlay**. This can be an image or video overlay, a text overlay, subtitles for a video or a 3D lookup table for images or videos.  

You will often want to adjust the dimension and position of the overlay. You do this by using the [w (width)](#w_width), [h (height)](#h_height), [x, y (x & y coordinates)](#x_y_coordinates) and [g (gravity)](#g_gravity) parameters with the overlay transformation. 

In addition to these common overlay transformations, you can apply nearly any supported image or video transformation to an image or video overlay, including applying [chained transformations](./layers#multiple_layer_transformations_fl_layer_apply), by using the [fl_layer_apply](#fl_layer_apply) flag to indicate the end of the layer transformations.

[//]: # ([\<public_id\>](#l_public_id) | [fetch](#l_fetch) | [lut](#l_lut) | [subtitles](#l_subtitles) | [text](#l_text)| [video](#l_video))

**Learn more**: 

* [Placing layers on images](./layers) 
* [Placing layers on videos](./video_layers) 
* Layer transformation syntax for [images](./layers#layer_transformation_syntax) and [videos](./video_layers#layer_transformation_syntax)
* Applying 3-color-dimension LUTs to [images](./effects_and_artistic_enhancements#3_color_dimension_luts_3d_luts) and [videos](./video_effects_and_enhancements#3_color_dimension_luts_3d_luts) 
* [Blending and masking layers](./effects_and_artistic_enhancements#blending_and_masking_layers)

**See also**: [u (underlay)](#u_underlay) 

### \<image id\>
&nbsp;`l_<image id>`

Overlays an image on the base image or video. 

Adjust the dimensions and position of the overlay with the [w (width)](#w_width), [h (height)](#h_height), [x, y (x & y coordinates)](#x_y_coordinates) and [g (gravity)](#g_gravity) parameters with the overlay transformation. 

#### Optional qualifiers
[bo (border)](#bo_border) | [c (crop/resize)](#c_crop_resize) | [du (duration)](#du_duration) | [e_anti_removal](#e_anti_removal) | [e_multiply](#e_multiply) | [e_overlay](#e_overlay) | [e_screen](#e_screen) | [eo (end offset)](#eo_end_offset) | [fl_no_overflow](#fl_no_overflow) | [fl_region_relative](#fl_region_relative) | [g_\<compass position\>](#g_compass_position) | [g_\<special position\>](#g_special_position) | [h (height)](#h_height) | [so (start offset)](#so_start_offset) | [w (width)](#w_width) | [x, y (x & y coordinates)](#x_y_coordinates)

**Learn more**: [Adding image overlays to images](./layers#image_overlays) | [Adding image overlays to videos](./video_layers#image_overlays)

#### Syntax details
| Value    | Type   | Description                                                   |
| -------- | ------ | ------------------------------------------------------------- |
| image id | string | **Required.** The public ID of the uploaded image to overlay. |

#### Examples
1. Add the overlay with the public ID `badge`, offset from the south east corner of the base image by (20, -40) pixels, while resizing the overlay to a width of 40 pixels (`l_badge/c_scale,w_40/fl_layer_apply,g_south_east,x_20,y_-40`):
   ![Badge overlay on top of a face](https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,h_130,w_130/l_badge/c_scale,w_40/fl_layer_apply,g_south_east,x_20,y_-40/face_top.jpg)
1. Add an overlay with the public ID `cloudinary_icon` that will be displayed over the video between seconds 1.5 and 4, with 50% opacity and a brightness of value 100 (`l_cloudinary_icon/o_50/e_brightness:100/eo_4.0,fl_layer_apply,so_1.5`):
   ![guy_woman_mobile.mp4 with overlay from 1.5s - 4s](https://res.cloudinary.com/demo/video/upload/l_cloudinary_icon/o_50/e_brightness:100/eo_4.0,fl_layer_apply,so_1.5/guy_woman_mobile.mp4 "thumb: h_150")

### audio
&nbsp;`l_audio:<audio id>`

Overlays the specified audio track on a base video or another audio track. If you specify a video to overlay, only the audio track will be applied.  You can use this to mix multiple audio tracks together or add additional audio tracks when using automatic streaming profile selection.

#### Optional qualifiers
[du (duration)](#du_duration) | [eo (end offset)](#eo_end_offset) | [fl_alternate](#fl_alternate)| [fl_layer_apply](#fl_layer_apply) | [fl_splice](#fl_splice) | [so (start offset)](#so_start_offset)

**Learn more**: [Adding audio overlays](./video_layers#audio_overlays) | [Mixing audio tracks](./audio_transformations#mixing_audio_tracks) | [Defining alternate audio tracks](./adaptive_bitrate_streaming#defining_alternate_audio_tracks)

#### Syntax details
| Value    | Type   | Description                                                                |
| -------- | ------ | -------------------------------------------------------------------------- |
| audio id | string | **Required.** The public ID of an uploaded video or audio file to overlay. |

#### Example
Mix together a  violin melody and a piano accompaniment (`l_audio:docs:franck:melody/fl_layer_apply/docs/franck/piano`):

![Piano with violin](https://res.cloudinary.com/demo/video/upload/l_audio:docs:franck:melody/fl_layer_apply/docs/franck/piano "with_image:false")

### fetch
&nbsp;`l_fetch:<base64 encoded URL>`

Overlays a remote image onto an image or video.

{note}
You can only fetch remote **images** for overlays. Fetching remote videos or audio files for use as overlays isn't supported.
{/note}

Adjust the dimensions and position of the overlay with the [w (width)](#w_width), [h (height)](#h_height), [x, y (x & y coordinates)](#x_y_coordinates) and [g (gravity)](#g_gravity) parameters with the overlay transformation. 

#### Optional qualifiers
[bo (border)](#bo_border) | [c (crop/resize)](#c_crop_resize) | [du (duration)](#du_duration) | [e_anti_removal](#e_anti_removal) | [e_multiply](#e_multiply) | [e_overlay](#e_overlay) | [e_screen](#e_screen) | [eo (end offset)](#eo_end_offset) | [fl_no_overflow](#fl_no_overflow) | [fl_region_relative](#fl_region_relative) | [g_\<compass position\>](#g_compass_position) | [g_\<special position\>](#g_special_position) | [h (height)](#h_height) | [so (start offset)](#so_start_offset) | [w (width)](#w_width) | [x, y (x & y coordinates)](#x_y_coordinates)

**Learn more**: [Adding image overlays](./layers#image_overlays)

#### Syntax details
| Value              | Type   | Description                                                                    |
| ------------------ | ------ | ------------------------------------------------------------------------------ |
| base64 encoded URL | string | **Required.** The base64 encoded URL of the remote image to use as an overlay. |

#### Examples
1. Add the blue Cloudinary logo with URL, `https://res.cloudinary.com/demo/image/upload/logos/cloudinary_full_logo_blue_small.png` (base64 encoded: `aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvbG9nb3MvY2xvdWRpbmFyeV9mdWxsX2xvZ29fYmx1ZV9zbWFsbC5wbmc=`), as an overlay, offset from the north west corner of the base image by (15, 15) pixels (`l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvbG9nb3MvY2xvdWRpbmFyeV9mdWxsX2xvZ29fYmx1ZV9zbWFsbC5wbmc=/fl_layer_apply,g_north_west,x_15,y_15`):
![Cloudinary overlay on woman with handbag](https://res.cloudinary.com/demo/image/upload/l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvbG9nb3MvY2xvdWRpbmFyeV9mdWxsX2xvZ29fYmx1ZV9zbWFsbC5wbmc=/fl_layer_apply,g_north_west,x_15,y_15/docs/model_handbag_640 "thumb: h_150")

1. Add the white Cloudinary logo with URL, `https://res.cloudinary.com/demo/image/upload/v1602436129/logos/cloudinary_full_logo_white_small.png` (base64 encoded: `aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvdjE2MDI0MzYxMjkvbG9nb3MvY2xvdWRpbmFyeV9mdWxsX2xvZ29fd2hpdGVfc21hbGwucG5n`), as an overlay to the first five seconds of the video, offset from the north west corner of the video by (15, 15) pixels (`l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvdjE2MDI0MzYxMjkvbG9nb3MvY2xvdWRpbmFyeV9mdWxsX2xvZ29fd2hpdGVfc21hbGwucG5n/eo_5.0,fl_layer_apply,g_north_west,x_15,y_15`):
![Fetched overlay on video](https://res.cloudinary.com/demo/video/upload/c_scale,w_0.3/l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvdjE2MDI0MzYxMjkvbG9nb3MvY2xvdWRpbmFyeV9mdWxsX2xvZ29fd2hpdGVfc21hbGwucG5n/eo_5.0,fl_layer_apply,g_north_west,x_15,y_15/guy_woman_mobile "thumb: h_150")

### lut
&nbsp;`l_lut:<lut public id>`

Applies a 3-color-dimension lookup table (a 3D LUT) to an image or video. Before applying a LUT layer, you must first upload the LUT file as a [raw file](./upload_parameters#uploading_non_media_files_as_raw_files).

**Learn more**: [Applying 3D LUTs to images](./effects_and_artistic_enhancements#3_color_dimension_luts_3d_luts) | [Applying 3D LUTs to videos](./video_effects_and_enhancements#3_color_dimension_luts_3d_luts)

#### Syntax details
| Value         | Type   | Description                                                                                        |
| ------------- | ------ | -------------------------------------------------------------------------------------------------- |
| lut public id | string | **Required.** The public ID of the raw LUT file, including the file extension (`.3dl` or `.cube`). |

#### Examples
1. Apply an aspen themed LUT file to an image (`l_lut:iwltbap_aspen.3dl/fl_layer_apply`):

    ![Apply an aspen themed LUT file to an image](https://res.cloudinary.com/demo/image/upload/l_lut:iwltbap_aspen.3dl/fl_layer_apply/ladybug_top.jpg "thumb: h_150")

1. Apply a sedona themed LUT file to a video (`l_lut:iwltbap_sedona.3dl/fl_layer_apply/`):

    ![Apply a sedona themed LUT file to a video](https://res.cloudinary.com/demo/video/upload/l_lut:iwltbap_sedona.3dl/fl_layer_apply/meadow_walk.mp4 "thumb: h_150")

### subtitles
&nbsp;`l_subtitles:<subtitle id>`

Embed subtitle texts from an SRT or WebVTT file into a video. The subtitle file must first be uploaded as a [raw file](./upload_parameters#uploading_non_media_files_as_raw_files). 

You can optionally set the font and font-size (as optional values of your `l_subtitles` parameter) as well as subtitle text color and **either** subtitle background color or subtitle outline color (using the `co` and `b`/`bo` optional qualifiers). By default, the texts are added in Arial, size 15, with white text and black border.

{note}
Subtitles can also be added to videos delivered via the HLS [adaptive bitrate streaming](./adaptive_bitrate_streaming) protocol using the [streaming profile](#sp_streaming_profile). This method enables support for multiple tracks as part of the manifest file. For more information, see [adding subtitles to HLS videos](./adaptive_bitrate_streaming#adding_subtitles_to_hls_videos).
{/note} 

#### Optional qualifiers
[b_\<color value\>](#b_color_value) | [bo (border)](#bo_border) | [co (color)](#co_color) | [g_\<compass position\>](#g_compass_position)

{note}
Unlike most other layers where the default gravity is `center`, the default gravity for subtitles is `south` (bottom of the video). You can use compass gravity positions (e.g., `g_north`, `g_west`, `g_south_east`) to control where subtitles appear, but **the `x` and `y` offset parameters are not supported** for subtitle layers.
{/note}

**Learn more**: [Adding subtitles](./video_layers#subtitles)

#### Syntax details
| Value       | Type   | Description                                                                                                                                                                                                                                                                                                                    |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| subtitle id | string | **Required.** The public ID of the uploaded subtitles file (either an [SRT](https://en.wikipedia.org/wiki/SubRip) or a [WebVTT](https://en.wikipedia.org/wiki/WebVTT) file). You can also optionally include font and font-size settings (separated with an underscore) **before** the subtitle public ID (see example below). |

#### Examples
Embed the text from the `sample_sub_en.srt` subtitle file in a video. Display the text in Arial, size 40 font, colored yellow, with a black background (`b_black,co_yellow,l_subtitles:arial_40:sample_sub_en.srt/fl_layer_apply`):

![Video with subtitles](https://res.cloudinary.com/demo/video/upload/b_black,co_yellow,l_subtitles:arial_40:sample_sub_en.srt/fl_layer_apply/guy_woman_mobile.mp4 "thumb: h_150")

### text
&nbsp;`l_text:<text style>:<text string>`

Adds a text overlay to an image or video.

Adjust the dimensions and position of the overlay with the [w (width)](#w_width), [h (height)](#h_height), [x, y (x & y coordinates)](#x_y_coordinates) and [g (gravity)](#g_gravity) parameters with the overlay transformation. 

#### Optional qualifiers
[b_\<color value\>](#b_color_value) | [bo (border)](#bo_border) | [c_fit](#c_fit) | [co (color)](#co_color)   | [e_anti_removal](#e_anti_removal) | [e_multiply](#e_multiply) | [e_overlay](#e_overlay) | [e_screen](#e_screen) | [fl_no_overflow](#fl_no_overflow) | [fl_text_disallow_overflow](#fl_text_disallow_overflow) | [fl_text_no_trim](#fl_text_no_trim) | [g_\<compass position\>](#g_compass_position) | [g_\<special position\>](#g_special_position) | [h (height)](#h_height) | [w (width)](#w_width) | [x, y (x & y coordinates)](#x_y_coordinates)

**Learn more**: [Adding text overlays to images](./layers#text_overlays) | [Adding text overlays to videos](./video_manipulation_and_delivery#adding_text_captions) | [Adding auto-line breaks](./layers#auto_line_breaks)

#### Syntax details
| Value       | Type   | Description                                                                                                                                                                                                                                                                                                                                                    |
| ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| text style  | string | **Required.** The text styling parameters to use for the text overlay, separated by underscores. The parameters must include the `font` and `size` parameters, the rest are optional. See the [styling parameters](#styling_parameters) table for a full listing of possible parameters (e.g.: `Arial_50` or `Helvetica_30_bold_underline_letter_spacing_20`). |
| text string | string | **Required.** The actual text to add as an overlay (e.g.: `Hello world`).**Note**: Text strings containing special characters need to be [escaped](./layers#special_characters).                                                                                                                                                                               |

#### Styling parameters
Possible styling parameters for text overlays include:

| {table:class=reference-two-col}Parameter | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \                                        | **Required.** The name of any universally available font or a **custom font**, specified as the public ID of a raw, authenticated font in your product environment. For details on custom fonts, see [Using custom fonts for text overlays](./layers#custom_fonts).                                                                                                                                                                                                                                                                                                                                                                                                                 |
| \                                        | **Required.** The size of the text in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| \                                        | The font weight. **Possible values**: `normal` (default)`bold``thin``light`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| \                                        | The font style. **Possible values**: `normal` (default) `italic`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| \                                        | The font decoration type.**Possible values**: `normal` (default)`underline``strikethrough`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| \                                        | The text alignment.**Possible values**: `left` (default)`center``right``end` `start``justify`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| \                                        | Whether to include an outline stroke. Set the color and weight of the stroke with the [bo (border)](#bo_border) parameter.**Possible values**: `none` (default) `stroke`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| letter\_spacing\_\                       | The spacing between the letters, in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| line\_spacing\_\                         | The spacing between multiple lines in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| antialias\_\                             | The antialias setting to apply to the text. When this parameter is not specified, the default antialiasing for the subsystem and target device are applied.**Possible values**: `none` - Use a bi-level alpha mask. `gray` - Perform single-color antialiasing. For example, using shades of gray for black text on a white background. `subpixel` - Perform antialiasing by taking advantage of the order of subpixel elements on devices such as LCD panels.`fast` - Some antialiasing is performed, but speed is prioritized over quality. `good` - Antialiasing that balances quality and performance. `best` - Renders at the highest quality, sacrificing speed if necessary. |
| hinting\_\                               | The outline hinting style to apply to the text. When this parameter is not specified, the default hint style for the font and target device are applied.**Possible values**: `none` - Do not hint outlines. `slight` - Hint outlines slightly to improve contrast while retaining good fidelity to the original shapes. `medium` - Hint outlines with medium strength, providing a compromise between fidelity to the original shapes and contrast. `full` - Hint outlines to maximize the contrast.                                                                                                                                                                                |

#### Examples
1. Overlay the text string "Style" in Verdana bold with a size of 75 pixels, underlined, and with 14 pixels spacing between the letters (`l_text:Verdana_50_bold_underline_letter_spacing_14:Style`):

    ![Smile! text overlay](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/l_text:Verdana_75_bold_underline_letter_spacing_14:Style/fl_layer_apply/alfa_car.jpg "thumb: h_150")

2. Add a text overlay stating "Smile!" (`!` = `%21` escaped) in yellow text with a blue 10 pixel outline stroke, using 100 pixel bold and italic Arial font with 50 pixel letter spacing (`co_yellow,l_text:Arial_200_bold_italic_stroke_letter_spacing_50:Smile%21/bo_10px_solid_blue/fl_layer_apply,g_south`):

    ![Smile! text overlay](https://res.cloudinary.com/demo/image/upload/bo_10px_solid_blue,co_yellow,l_text:Arial_100_bold_italic_stroke_letter_spacing_50:Smile%21/fl_layer_apply,g_south/docs/camera-640.jpg "thumb: h_150")

### video
&nbsp;`l_video:<video id>`

Overlays the specified video on a base video.

Adjust the dimensions and position of the overlay with the [w (width)](#w_width), [h (height)](#h_height), [x, y (x & y coordinates)](#x_y_coordinates) and [g (gravity)](#g_gravity) parameters with the overlay transformation. 

#### Optional qualifiers
[bo (border)](#bo_border) | [c (crop/resize)](#c_crop_resize) | [du (duration)](#du_duration) | [e_transition](#e_transition) | [eo (end offset)](#eo_end_offset) | [fl_layer_apply](#fl_layer_apply) | [fl_splice](#fl_splice) | [g_\<compass position\>](#g_compass_position) | [h (height)](#h_height) | [so (start offset)](#so_start_offset) | [w (width)](#w_width) | [x, y (x & y coordinates)](#x_y_coordinates)

**Learn more**: [Adding video overlays](./video_layers#video_overlays) 

#### Syntax details
| Value    | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| video id | string | **Required.** The public ID of an uploaded video to overlay. |

#### Example
Add a video overlay of the `guy_woman_mobile` video, to the same video, but half the size (`l_video:guy_woman_mobile/c_scale,w_0.5/fl_layer_apply`):

![Adding a video overlay](https://res.cloudinary.com/demo/video/upload/l_video:guy_woman_mobile/c_scale,w_0.5/fl_layer_apply/guy_woman_mobile.mp4 "thumb: h_150")

## o (opacity)
&nbsp;`o_<opacity level>`

Adjusts the opacity of an asset and makes it semi-transparent. 

{note}
If the image format does not support transparency, the background color is used instead as a base (white by default). The color can be changed with the [background](#setting_background_color) parameter.
{/note}

**See also**: [Arithmetic expressions](./user_defined_variables#arithmetic_expressions)

#### Syntax details
| Value         | Type    | Description                                                                                                     |
| ------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| opacity level | integer | **Required.** The level of opacity. 100 means opaque, while 0 is completely transparent. **Range**: `0 to 100`. |

#### Examples
1. Reduce image opacity to 30% (`o_30`):
        ![Image delivered with 30% opacity](https://res.cloudinary.com/demo/image/upload/o_30/autumn_leaves.jpg "thumb: h_150")

2. Add the `badge` image as a (resized) overlay with an opacity of 60% `l_badge/c_scale,w_500/o_60/fl_layer_apply`:
        ![Image overlay delivered with 60% opacity](https://res.cloudinary.com/demo/image/upload/l_badge/c_scale,w_500/o_60/fl_layer_apply/autumn_leaves.jpg "thumb: h_150")

## p (prefix) (deprecated)

This method was used in conjunction with sprites. 
A sprite is a single image made up of many smaller images, historically used to reduce the number of HTTP requests on web pages. While this strategy was once frequently used, itâ€™s no longer commonly recommended.> **INFO**:
>
> The **Sprite** feature will be deprecated as of **September 16, 2025**, and will no longer function after that date. Be sure to remove it from any production code.

## pg (page or file layer)
&nbsp;

Delivers specified pages, frames, or layers of a multi-page/frame/layer file, such as a PDF, animated image, TIFF, or PSD.

**Learn more**: [PDF and Photoshop files](./paged_and_layered_media) | [Animated images](./animated_images#deliver_a_single_frame)

> **NOTE**: When using an SDK that uses [action-based syntax](./cloudinary_sdks#sdks_with_action_based_syntax), the action that exposes this method is `extract`.

### \<number\>
&nbsp; `pg_<number>`

Delivers a page or layer of a multi-page or multi-layer file (PDF, TIFF, PSD), or a specified frame of an animated image.

#### Optional qualifier
[fl\_clip](#fl_clip)

#### Syntax details
| Value  | Type    | Description                                                |
| ------ | ------- | ---------------------------------------------------------- |
| number | integer | **Required.** The page, frame, or layer number to deliver. |

#### Example
Generate an image of the second page of a PDF (`pg_2`).

![Image of second page of a PDF](https://res.cloudinary.com/demo/image/upload/pg_2/multi_page_pdf.jpg "thumb: h_150")

### \<range\>
&nbsp; `pg_<range>`

Delivers the specified range of pages or layers from a multi-page or multi-layer file (PDF, TIFF, PSD).

#### Syntax details
| Value | Type   | Description                                                                                                                                                                                                                                                               |
| ----- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| range | string | **Required.** The pages or layers to deliver. Use semicolons to separate a list of pages/layers: `pg_3;5;7`Use hyphens to indicate a page/layer range: `pg_3-5`Use a hyphen with no ending number to indicate starting from a specified page/layer until the end: `pg_5-` |

#### Example
Deliver layers 2-5, 7 and 10 of a Photoshop file (`pg_2-5;7;10`).

![Delivering Photoshop layers by number](https://res.cloudinary.com/demo/image/upload/pg_2-5;7;10/docs/cld_record_PSD.jpg "thumb: h_150")

### embedded
&nbsp; `pg_embedded:<index>`

Extracts and delivers an object embedded in a PSD file, by index.

#### Syntax details
| Value | Type    | Description                                              |
| ----- | ------- | -------------------------------------------------------- |
| index | integer | **Required.**  The layer index of the object to extract. |

#### Example
Deliver the embedded object at index 8 in the layers of the PSD file (`pg_embedded:8`).

![Indexed object in a PSD file](https://res.cloudinary.com/demo/image/upload/pg_embedded:8/docs/cld_sample_smart_PSD.jpg "thumb: h_150")

&nbsp; `pg_embedded:name:<layer name>`

Extracts and delivers an object embedded in a PSD file, by layer name.

#### Syntax details
| Value      | Type   | Description                                                 |
| ---------- | ------ | ----------------------------------------------------------- |
| layer name | string | **Required.**  The layer name of the embedded smart object. |

#### Example
Deliver the embedded object with layer name `skyline-3242040_1920` from the PSD file (`pg_embedded:name:skyline-3242040_1920`).

![Named object in a PSD file](https://res.cloudinary.com/demo/image/upload/pg_embedded:name:skyline-3242040_1920/docs/cld_sample_smart_PSD.jpg "thumb: h_150")

### name
&nbsp; `pg_name:<layer name(s)>`

Delivers one or more named layers from a PSD file.

#### Syntax details
| Value         | Type   | Description                                                                                           |
| ------------- | ------ | ----------------------------------------------------------------------------------------------------- |
| layer name(s) | string | **Required.**  The name of the layer(s) to deliver. Use semicolons to separate a list of layer names. |

#### Example
Deliver the layers named `record_cover`, `Shadow` and `logo` from a PSD file (`pg_name:record_cover;Shadow;logo`).

![Two layers of a Photoshop file](https://res.cloudinary.com/demo/image/upload/pg_name:record_cover;Shadow;logo/docs/cld_record_PSD.jpg "thumb: h_150")

## q (quality)

&nbsp;`q_<quality value>`

Controls the quality of the delivered asset. Reducing the quality is a trade-off between visual quality and file size.

**Learn more**: 

* [How to optimize image quality](./image_optimization#how_to_optimize_image_quality) 
* [How to optimize video quality](./video_optimization#how_to_optimize_video_quality)

### \<quality level\>
&nbsp;`q_<quality level>[:qmax_<quant value>][:<chroma>]`

Sets the quality to the specified level.

{warning}
A quality level of 100 can increase the file size significantly, particularly for video, as it is delivered lossless and uncompressed. As a result, a video with a quality level of 100 isn't playable on every browser.
{/warning}

**See also**: [Arithmetic expressions](./user_defined_variables#arithmetic_expressions)

#### Syntax details
| Value         | Type     | Description                                                                                                                                                                                                                                                                                                      |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| quality level | integer  | **Required.** The level of quality. **Range**: `1 to 100`.                                                                                                                                                                                                                                                       |
| quant value   | integer  | **Videos only.** The maximum quantization value, used when transcoding to WebM (VP8/9). Helps to ensure that the video is not over-quantized, see [Control the quality of WebM transcoding](./video_optimization#control_the_quality_of_webm_transcoding) for details.**Range**: `1 to 100`. **Default**: `100`. |
| chroma        | constant | The chroma subsampling setting. See [Toggling chroma subsampling](./image_optimization#toggle_chroma_subsampling) for details.**Possible values**: `420` - forces subsampling`444` - prevents subsampling.                                                                                                       |

#### Examples
1. Deliver an image of the highest quality (302KB) (`q_100`):
    ![Highest quality image](https://res.cloudinary.com/demo/image/upload/q_100/docs/wines.jpg "thumb: h_150")
2. Deliver a low quality image (44KB) (`q_20`):
    ![Low quality image](https://res.cloudinary.com/demo/image/upload/q_20/docs/wines.jpg "thumb: h_150")
3. Deliver a 60% quality image while forcing chroma subsampling (108KB) (`q_60:420`):
    ![Mid quality image with chroma subsampling](https://res.cloudinary.com/demo/image/upload/q_60:420/docs/wines.jpg "thumb: h_150")
4. Transcode the first 30 seconds of a video to WebM with 70% quality, setting the maximum quantization to 20% (`q_70:qmax_20`):
    ![Football video transcoded to WebM](https://res.cloudinary.com/demo/video/upload/du_30.0/q_70:qmax_20/Liverpool_vs_Roma_full.webm "thumb: h_150")

### auto
&nbsp;`q_auto[:<quality type>][:sensitive]`

Delivers an asset with an automatically determined level of quality.

**Learn more**: [Automatic quality for images](./image_optimization#automatic_quality_selection_q_auto) | [Automatic quality for videos](./video_optimization#automatic_quality_q_auto) | [Automatic quality for PDFs](./pdf_optimization)

**Related flag**: [fl_any_format](#fl_any_format)

#### Syntax details
| Value        | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| quality type | constant | The type of automatic quality. Not applicable to PDFs.**Possible values**: `best`: Ensures the best visual quality, using a less aggressive algorithm`good`: Ensures optimal visual quality without affecting its perceptual quality`eco`: Ensures a smaller file size using a more aggressive algorithm`low`: Ensures the smallest file size using the most aggressive algorithm**Default**: `good`. The addition of `:sensitive` (supported for images only) raises the quality level slightly, providing more granularity. For example, `q_auto:good:sensitive` gives a quality level above `good`, but not as good as the `best` level. (`q_auto:sensitive` is the same as `q_auto:good:sensitive`.) |

#### Examples
1. Automatically deliver a high quality image (174KB) (`q_auto:best`):
    ![High quality image](https://res.cloudinary.com/demo/image/upload/q_auto:best/docs/wines.jpg "thumb: h_150")
2. Automatically deliver the optimal quality for an image: the smallest file size without affecting its visual quality (144KB) (`q_auto:good`):
    ![Good quality image](https://res.cloudinary.com/demo/image/upload/q_auto:good/docs/wines.jpg "thumb: h_150")
3. Automatically deliver a good quality image at a lower file size (113KB) (`q_auto:eco`):
    ![Mid quality image](https://res.cloudinary.com/demo/image/upload/q_auto:eco/docs/wines.jpg "thumb: h_150")
4. Automatically deliver a small-sized image with low quality (95KB) (`q_auto:low`):
    ![Low quality image](https://res.cloudinary.com/demo/image/upload/q_auto:low/docs/wines.jpg "thumb: h_150")
5. Automatically deliver a small-sized image with quality between low and eco (102KB) (`q_auto:low:sensitive`):
    ![Low quality image](https://res.cloudinary.com/demo/image/upload/q_auto:low:sensitive/docs/wines.jpg "thumb: h_150")

## r (round corners)

&nbsp;

Rounds the corners of an image or video. 

**Learn More**: [Rounding image corners](./effects_and_artistic_enhancements#rounding_corners_and_creating_circular_images) | [Rounding video corners](./video_effects_and_enhancements#rounding)

### \<radius\>
&nbsp;`r_<pixel value>`

Rounds all four corners of an asset by the same pixel radius. 

**See also**: [Arithmetic expressions](./user_defined_variables#arithmetic_expressions)

#### Syntax details
| Value       | Type    | Description                                                               |
| ----------- | ------- | ------------------------------------------------------------------------- |
| pixel value | integer | **Required.** The radius value to apply to all four corners of the asset. |

#### Example
Generate an 800 pixel width video with rounded corners of 150 pixels (`c_scale,w_800/r_150`).  
Note that the HTML5 video player controls are overlaid without a radius, but when the video plays and the controls are hidden, all four rounded corners can be seen: 

![video with rounded corners of 150 pixels radius](https://res.cloudinary.com/demo/video/upload/c_scale,w_800/r_150/docs/van-driving-mountain-road.mp4 "thumb:ac_none,h_150, poster: https://res.cloudinary.com/demo/video/upload/c_scale,w_800/r_150/f_auto/fl_preserve_transparency/docs/van-driving-mountain-road")

### \<selected corners\>
&nbsp;`r_<value1>[:<value2>][:<value3>][:<value4>]`

Rounds selected corners of an image, based on the number of values specified, similar to the `border-radius` CSS property: 

#### Syntax details
| \# of values | Type     | Description                                                                                                                                                                                                          |
| ------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2 values     | integers | `value1` controls the pixel radius of the **top-left** and **bottom-right** corners.`value2` controls the pixel radius of the **top-right** and **bottom-left** corners.                                             |
| 3 values     | integers | `value1` controls the pixel radius of the **top-left** corner. `value2` controls the pixel radius of the **top-right** & **bottom-left** corners. `value3` controls the pixel radius of the **bottom-right** corner. |
| 4 values     | integers | The pixel radius of each corner is defined separately, where the values represent the corners in clockwise order, starting with the **top-left**.                                                                    |

#### Examples
{collapsed}

1. Generate an image with three rounded corners of varying radii (`r_20:0:40:60`):
![3 rounded corners of varying radii](https://res.cloudinary.com/demo/image/upload/r_20:0:40:60/white_chicken.png "thumb: h_150")
2. Generate an image with two rounded corners of 20 pixels in radius, and two rounded corners of 80 pixels in radius (`r_20:80`):
![4 rounded corners, 2 of 20 and 2 of 80](https://res.cloudinary.com/demo/image/upload/r_20:80/white_chicken.png "thumb: h_150")

### max
&nbsp;`r_max`

Delivers the asset as a rounded circle or oval shape. 

* If the input asset is a 1:1 aspect ratio, it will be a circle. 
* If rectangular, it will be an oval.

#### Examples
1. Generate an image with an oval crop using the 'max' radius value (`r_max`):
![Oval crop using the 'max' radius value](https://res.cloudinary.com/demo/image/upload/r_max/white_chicken.png "thumb: h_150")
1. Generate an image with a circular crop by resizing it to a square and then using the 'max' radius value (`ar_1.0,c_fill/r_max`):
![Circular crop using the 'max' radius value](https://res.cloudinary.com/demo/image/upload/ar_1.0,c_fill/r_max/white_chicken.png "thumb: h_150")

## so (start offset)
&nbsp;`so_<time value>`

Specifies the first second to include in the video (or audio clip). This parameter is often used in conjunction with the [eo (end offset)](#eo_end_offset) and/or [du (duration)](#du_duration) parameters.

* Can be used independently to **trim** the video (or audio clip) by specifying the first second of the video to include. Everything prior to that second is trimmed off.
* Can be used as a [qualifier](#parameter_types) to control the timing of a corresponding transformation.
* Can be used to indicate the frame of the video to use for generating video thumbnails.

**As a qualifier, use with**: [e\_boomerang](#e_boomerang) | [l\_audio](#l_audio) | [l\_\<image id\>](#l_image_id) | [l\_video](#l_video) 

**Learn more**: [Trimming videos](./video_trimming_and_concatenating#trimming_videos) | [Adding video overlays](./video_layers#video_overlays) | [Adding audio overlays to videos](./video_layers#audio_overlays) | [Adding image overlays to videos](./video_layers#image_overlays) | [Video thumbnails](./video_effects_and_enhancements#video_thumbnails)

**See also**: [fl_splice](#fl_splice)

#### Syntax details
| Value      | Type                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| time value | number &#124; string &#124; constant | **Required.** The offset time from the beginning of the video (or audio clip). Can be specified as: A float (in seconds)A string, representing the time as a percentage of the video, in the format `##p` or `##%`. For example, `25p` represents the frame that is 25% from the beginning of the video.A constant value of `auto` (relevant only for [video thumbnails](./video_effects_and_enhancements#video_thumbnails)). This value automatically selects a frame that best matches the average value of a color distribution analysis of the first few seconds of the video, making it more likely to display a typical frame. |

#### Examples
1. Trim everything before the 10th second from the start of the video (`so_10`):
![Trim a video](https://res.cloudinary.com/demo/video/upload/so_10/blue_sports_car.mp4 "thumb:ac_none,h_150")
1. Overlay a scaled-down version of the `ski_jump` video over the `blue_sports_car` video, starting from the third second of the blue sports car video--the start offset, and removing the overlay after 6 seconds--the end offset (`l_video:ski_jump/c_scale,w_600/eo_6.0,fl_layer_apply,g_north_east,so_3.0`):
![Control the timing of an overlaid video](https://res.cloudinary.com/demo/video/upload/l_video:ski_jump/c_scale,w_600/eo_6.0,fl_layer_apply,g_north_east,so_3.0/blue_sports_car.mp4 "thumb:ac_none,h_150")
1. Automatically select a frame to be used as a thumbnail or poster image for the video (`so_auto`):
![Poster image](https://res.cloudinary.com/demo/video/upload/so_auto/docs/walking_talking.jpg "thumb:ac_none,h_150")

## sp (streaming profile)
&nbsp;

Determines the streaming profile to apply when delivering a video using adaptive bitrate streaming.

### auto
&nbsp;`sp_auto[:maxres_<maximum resolution>][;subtitles_<subtitles config>]`

Lets Cloudinary choose the best streaming profile on the fly for both HLS and DASH. You can limit the resolution at which to stream the video by specifying the maximum resolution.

**Learn more**: [Automatic streaming profile selection](./adaptive_bitrate_streaming#automatic_streaming_profile_selection)

#### Syntax details
| Value              | Type              | Description                                                                                                                                                                                                                                                                                         |
| ------------------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maximum resolution | string            | The maximum resolution to use for streaming the video.  **Possible values**: `2160p`, `1440p`, `1080p`, `720p`, `540p`,  `360p`.**Default**: `1080p`                                                                                                                                                |
| subtitles config   | Cloudinary object | The configuration for subtitles to be added for videos delivered using HLS. The configuration is supplied using Cloudinary specific URL syntax to represent a JSON-like object. See [Adding subtitles to HLS videos](./adaptive_bitrate_streaming#adding_subtitles_to_hls_videos) for more details. |

#### Examples
1. Automatically apply the best streaming profile to the video using HLS (`sp_auto`):
![Automatic streaming profile example](https://res.cloudinary.com/demo/video/upload/sp_auto/docs/waterfall.m3u8 "with_image: false")
![Automatic streaming profile example](https://res.cloudinary.com/demo/video/upload/docs/waterfall "thumb: h_150, with_code: false, with_url: false")

1. Automatically apply the best streaming profile to the video using DASH (`sp_auto`):
![Automatic streaming profile example](https://res.cloudinary.com/demo/video/upload/sp_auto/docs/waterfall.mpd "with_image: false")
![Automatic streaming profile example](https://res.cloudinary.com/demo/video/upload/docs/waterfall "thumb: h_150, with_code: false, with_url: false")

1. Automatically apply the best streaming profile to the video, limiting the resolution to 720p (`sp_auto:maxres_720p`):
![Automatic streaming profile example](https://res.cloudinary.com/demo/video/upload/sp_auto:maxres_720p/docs/waterfall.m3u8 "with_image: false")
![Automatic streaming profile with limited resolution example](https://res.cloudinary.com/demo/video/upload/docs/waterfall "thumb: h_150, with_code: false, with_url: false")

### \<profile name\>
&nbsp;`sp_<profile name>[:subtitles_<subtitles config>]`

Specifies the streaming profile to apply when delivering a video using HLS or MPEG-DASH adaptive bitrate streaming. Optionally allows for defining subtitles tracks for HLS, which will be defined as part of the manifest file.

#### Optional qualifier
[fl_hlsv3](#fl_hlsv3)

**Learn more**: [Adaptive bitrate streaming](./adaptive_bitrate_streaming) | [Pre-defined streaming profiles](./adaptive_bitrate_streaming#predefined_streaming_profiles) | [Create new custom streaming profiles](./admin_api#create_a_streaming_profile)

#### Syntax details
| Value            | Type              | Description                                                                                                                                                                                                                                                                                         |
| ---------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| profile name     | string            | **Required.** The name of the streaming profile to use. Possible values: [Predefined streaming profile](./adaptive_bitrate_streaming#predefined_streaming_profiles)[Custom streaming profile](./admin_api#create_a_streaming_profile)                                                               |
| subtitles config | Cloudinary object | The configuration for subtitles to be added for videos delivered using HLS. The configuration is supplied using Cloudinary specific URL syntax to represent a JSON-like object. See [Adding subtitles to HLS videos](./adaptive_bitrate_streaming#adding_subtitles_to_hls_videos) for more details. |

#### Examples
1. Apply the `full_hd` streaming profile to the video (`sp_full_hd`):
![Full hd streaming profile example](https://res.cloudinary.com/demo/video/upload/sp_full_hd/sunglasses.m3u8 "with_image: false")
![Full hd streaming profile example](https://res.cloudinary.com/demo/video/upload/sunglasses "thumb: h_150, with_code: false, with_url: false")
1. Apply the custom streaming profile `custom_square` to the video (`sp_custom_square`):
![Custom streaming profile example](https://res.cloudinary.com/demo/video/upload/sp_custom_square/fashion_coat.m3u8 "with_image: false")
![Custom streaming profile example](https://res.cloudinary.com/demo/video/upload/fashion_coat "thumb: h_150, with_code: false, with_url: false")

## t (named transformation)
&nbsp;`t_<transformation name>`

Applies a pre-defined named transformation to an image or video.

**Learn more**: [Named transformations](./image_transformations#named_transformations) | [Create a named transformation](./admin_api#create_a_named_transformation)

#### Syntax details
| Value               | Type   | Description                                                      |
| ------------------- | ------ | ---------------------------------------------------------------- |
| transformation name | string | **Required.** The name of the pre-defined transformation to use. |

#### Example
Apply the `vignette_angle` named transformation to the image (`t_vignette_angle`). The underlying transformation is `e_vignette:90/a_45`:

![Flowers with vignette and angled](https://res.cloudinary.com/demo/image/upload/t_vignette_angle/docs/hot-air-balloons.jpg "thumb: h_150")

## u (underlay)

&nbsp;

Applies an image layer under the base image or video, also known as an **underlay**.

You can adjust the dimensions and position of the underlay using the [w (width)](#w_width), [h (height)](#h_height), [x, y (x & y coordinates)](#x_y_coordinates) and [g (gravity)](#g_gravity) parameters with the underlay transformation. 

In addition to these common underlay transformations, you can apply nearly any supported image transformation to an image underlay, including applying [chained transformations](./image_transformations#chained_transformations), by using the [fl_layer_apply](#fl_layer_apply) flag to indicate the end of the layer transformations.

**Learn more**: 

* [Adding image underlays](./layers#image_underlays) 
* [Blending and masking layers](./effects_and_artistic_enhancements#blending_and_masking_layers)

**See also**: [l (layer)](#l_layer) 

### \<image id\>
&nbsp;`u_<image id>`

Applies an image layer under the base image or video. Specify the public ID of the image to use as the underlay.

Adjust the dimensions and position of the underlay with the [w (width)](#w_width), [h (height)](#h_height), [x, y (x & y coordinates)](#x_y_coordinates) and [g (gravity)](#g_gravity) parameters with the underlay transformation. 

#### Optional qualifiers
[bo (border)](#bo_border) | [c (crop/resize)](#c_crop_resize) | [e_anti_removal](#e_anti_removal) | [e_multiply](#e_multiply) | [e_overlay](#e_overlay) | [e_screen](#e_screen) |  [e_mask](#e_mask) [fl_region_relative](#fl_region_relative) | [fl_relative](#fl_relative) | [g_\<compass position\>](#g_compass_position) | [g_\<special position\>](#g_special_position) | [h (height)](#h_height) | [w (width)](#w_width) | [x, y (x & y coordinates)](#x_y_coordinates)

**Learn more**: [Adding image underlays](./layers#image_underlays)

#### Syntax details
| Value    | Type   | Description                                                      |
| -------- | ------ | ---------------------------------------------------------------- |
| image id | string | **Required.** The public ID of the image to use as the underlay. |

#### Examples
1. Add the underlay with the public ID `site_bg`, resized to match the size of the base image (`u_site_bg/c_fill,fl_layer_apply,fl_relative,h_1.0,w_1.0`):

    ![Image underlay resized to match base image](https://res.cloudinary.com/demo/image/upload/u_site_bg/c_fill,fl_layer_apply,fl_relative,h_1.0,w_1.0/smartphone.png "thumb: h_150")

1. Add the underlay with the public ID `site_bg` underneath a transparent WebM, resized to match the size of the base video (`u_site_bg/c_fill,fl_layer_apply,fl_relative,h_1.0,w_1.0`):

    ![Image underlay resized to match base video](https://res.cloudinary.com/demo/video/upload/u_site_bg/c_fill,fl_layer_apply,fl_relative,h_1.0,w_1.0/docs/transparent_talking.webm "thumb: h_150")

### fetch
{actionType}&nbsp;`u_fetch:<base64 encoded URL>`

Places a remote image under an image or video.

> **NOTE**:
>
> You can only fetch remote **images** for underlays. Fetching remote videos or audio files for use as underlays isn't supported.

Adjust the dimensions and position of the underlay with the [w (width)](#w_width), [h (height)](#h_height), [x, y (x & y coordinates)](#x_y_coordinates) and [g (gravity)](#g_gravity) parameters with the underlay transformation. 

#### Optional qualifiers
[bo (border)](#bo_border) | [c (crop/resize)](#c_crop_resize) | [du (duration)](#du_duration) | [e_anti_removal](#e_anti_removal) | [e_multiply](#e_multiply) | [e_overlay](#e_overlay) | [e_screen](#e_screen) | [eo (end offset)](#eo_end_offset) | [fl_no_overflow](#fl_no_overflow) | [fl_region_relative](#fl_region_relative) | [g_\<compass position\>](#g_compass_position) | [g_\<special position\>](#g_special_position) | [h (height)](#h_height) | [so (start offset)](#so_start_offset) | [w (width)](#w_width) | [x, y (x & y coordinates)](#x_y_coordinates)

**Learn more**: [Adding image underlays](./layers#image_underlays)

#### Syntax details
| Value              | Type   | Description                                                                     |
| ------------------ | ------ | ------------------------------------------------------------------------------- |
| base64 encoded URL | string | **Required.** The base64 encoded URL of the remote image to use as an underlay. |

#### Examples
1. Add the background image, `https://res.cloudinary.com/demo/image/upload/site_bg` (base64 encoded: `aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvc2l0ZV9iZw==`), as an underlay, resized to match the size of the base image (`u_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvc2l0ZV9iZw==/c_fill,fl_layer_apply,fl_relative,h_1.0,w_1.0`):

    ![Fetched image underlay resized to match base image](https://res.cloudinary.com/demo/image/upload/u_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvc2l0ZV9iZw==/c_fill,fl_layer_apply,fl_relative,h_1.0,w_1.0/smartphone.png "thumb: h_150")

1. Add the background image, `https://res.cloudinary.com/demo/image/upload/site_bg` (base64 encoded: `aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvc2l0ZV9iZw==`), as an underlay, resized to match the size of the base video (`u_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvc2l0ZV9iZw==/c_fill,fl_layer_apply,fl_relative,h_1.0,w_1.0`):

    ![Fetched image underlay resized to match base video](https://res.cloudinary.com/demo/video/upload/u_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvc2l0ZV9iZw==/c_fill,fl_layer_apply,fl_relative,h_1.0,w_1.0/docs/transparent_talking.webm "thumb: h_150")

{/actionType}

## vc (video codec)
&nbsp;

Sets the video codec to use when encoding a video.

**Learn more**: [Video codec settings](./video_manipulation_and_delivery#video_codec_settings)

### \<codec value\>
&nbsp;`vc_<codec value>[:<profile>[:<level>][:bframes_<bframes>]]`

Sets a specific video codec to use to encode a video. For `h264`, optionally include the desired profile and level.

#### Syntax details
| Value       | Type     | Description                                                                                                                                                                                                                     |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| codec value | constant | **Required.** The video codec. **Possible values**:`h264`, `h265`, `av1`,  `prores` (422HQ),`theora`, `vp8`, `vp9`.                                                                                                             |
| profile     | constant | The profile to use with the `h264` codec. **Possible values**: `baseline`, `main`, `high`, `high444`, `auto` (required when specifying `bframes`).**Default**: `high`. 1                                                        |
| level       | constant | The level to use with the `h264` codec and specified profile. **Possible values**: `3.0`, `3.1`, `4.0`, `4.1`, `4.2`, `5.0`, `5.1`, `5.2`, `auto` (required when specifying `bframes`).**Default**: `3.1`.                      |
| bframes     | constant | Whether to include b-frames with the video. Can be disabled for videos with the `h265` codec. **Possible values**: `no`.**Default**: b-frames are enabled by default so this value should be omitted unless disabling b-frames. |

#### Examples
Set the video codec to h264, the profile to baseline and the level to 3.1 (`vc_h264:baseline:3.1`):

![Video codec h264 with baseline profile and 3.1 level](https://res.cloudinary.com/demo/video/upload/vc_h264:baseline:3.1/guy_woman_mobile.mp4 "thumb:ac_none,h_150")

Set the video codec to h265 and disable b-frames (`vc_h265:auto:auto:bframes_no`):

![Video codec h265 with disabled bframes](https://res.cloudinary.com/demo/video/upload/vc_h265:auto:auto:bframes_no/guy_woman_mobile.mp4 "thumb:ac_none,h_150")

### auto
&nbsp;`vc_auto`

Normalizes and optimizes a video by automatically selecting the most appropriate codec based on the output format.

The settings for each format are:

| Format   | Video codec | Profile | Quality     | Audio Codec | Audio Frequency |
| -------- | ----------- | ------- | ----------- | ----------- | --------------- |
| **MP4**  | `h264`      | `high`1 | `auto:good` | `aac`       | `22050`         |
| **WebM** | `vp9`2      | N/A     | `auto:good` | `vorbis`    | `22050`         |
| **OGV**  | `theora`    | N/A     | `auto:good` | `vorbis`    | `22050`         |

{notes:title=Footnotes}

1. For older Cloudinary accounts the default is `baseline`. [Submit a support request](https://support.cloudinary.com/hc/en-us/requests/new) to change this default.
2. For older Cloudinary accounts the default is `vp8`. [Submit a support request](https://support.cloudinary.com/hc/en-us/requests/new) to change this default.

{/notes}

#### Optional qualifiers
[af_iaf](#af_audio_frequency)

#### Example
Normalize the MP4 video for web with the default settings (`vc_auto`):

![MP4 with automatic codec selection](https://res.cloudinary.com/demo/video/upload/vc_auto/guy_woman_mobile.mp4 "thumb:ac_none,h_150")

### none
&nbsp;`vc_none`

Removes the video codec to leave just the audio, useful when you want to extract the audio from a video.

#### Example
Remove the video codec to deliver just the audio (`vc_none`):

![Video with no video codec](https://res.cloudinary.com/demo/video/upload/vc_none/ski_jump.mp4 "thumb:h_150, with_image: false")

## vs (video sampling)

&nbsp;`vs_<sampling rate>`

Sets the sampling rate to use when converting videos or animated images to animated GIF or WebP format. If not specified, the resulting GIF or WebP samples the whole video/animated image (up to 400 frames, at up to 10 frames per second). By default, the duration of the resulting animated image is the same as the duration of the input, no matter how many frames are sampled from the original video/animated image (use the [dl (delay)](#dl_delay) parameter to adjust the amount of time between frames).

**Related flag**: [fl_animated](#fl_animated)

**Learn more**: [Converting videos to animated images](./videos_to_animated_images)

#### Syntax details
| Value         | Type                  | Description                                                                                                                                                                                                                                                                                                                                                                              |
| ------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sampling rate | integer &#124; string | **Required.** The sampling rate. Can be set as: An integer defining the total number of frames to sample from the original asset. The frames are spread out over the length of the video/animated image, e.g. `20` takes one frame every 5%.A string defining the number of seconds between each frame to sample from the original asset. e.g. `2.3s` takes one frame every 2.3 seconds. |

#### Examples
1. Generate a GIF using a sample of 40 frames from the original video (`vs_40`):
    ![Rubik's cube video](https://res.cloudinary.com/demo/video/upload/vs_40/cld_rubix.gif "thumb: e_loop,h_150")

1. Generate a GIF by taking a frame every 0.25 seconds from the original GIF (`vs_0.25s`):
    ![Animated spiral](https://res.cloudinary.com/demo/image/upload/vs_0.25s/spiral_animated.gif "thumb: e_loop,h_150")

## w (width)

&nbsp;

A [qualifier](#parameter_types) that sets the desired width of an asset using a specified value, or automatically based on the available width.

 

### \<width value\>
&nbsp;`w_<width value>`

A [qualifier](#parameter_types) that determines the width of a transformed asset or an overlay.

**Use with**: [c (crop/resize)](#c_crop_resize) | [l (layer)](#l_layer) | [e\_blur\_region](#e_blur_region) | [e\_pixelate\_region](#e_pixelate_region) | [u (underlay)](#u_underlay)

**Learn more**: [Resizing and cropping images](./resizing_and_cropping) | [Placing layers on images](./layers) | [Placing layers on videos](./video_layers)

**See also**: [h (height)](#h_height) | [ar (aspect ratio)](#ar_aspect_ratio) | [Arithmetic expressions](./user_defined_variables#arithmetic_expressions)

#### Syntax details
| Value       | Type                                 | Description                                                                                                                                                                                                                                                                                                                                                       |
| ----------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| width value | integer &#124; float &#124; constant | **Required.** The width of the asset. Set to:An **integer** value to set the width to the given number in pixels (e.g., `150` sets the width to exactly 150 pixels).A **decimal** value to set the width to a multiple of the original dimension (e.g., `0.5` sets the width to half the original width).`iw` to specify the initial width of the original image. |

#### Examples
1. Resize the image to a width of 100 pixels while maintaining aspect ratio (`c_scale,w_100`):

    ![Resize to a width of 100](https://res.cloudinary.com/demo/image/upload/c_scale,w_100/face_top.jpg "thumb: h_150")

1. Resize the image to 50% of its original width (`c_scale,w_0.5`):

    ![Resize to 50% of original width](https://res.cloudinary.com/demo/image/upload/c_scale,w_0.5/docs/camera-640.jpg "thumb: h_150")

 

### auto
A [qualifier](#parameter_types) that determines how to automatically resize an image to match the width available for the image in a responsive layout. The parameter can be further customized by overriding the default [rounding step](#w_auto_rounding_step) or by using automatic [breakpoints](#w_auto_breakpoints).

&nbsp;`w_auto[:<rounding step>][:<fallback width>]` 

The width is rounded up to the nearest rounding step (every 100 pixels by default) in order to avoid creating extra derived images and consuming too many extra transformations. Only works for certain browsers and when Client-Hints are enabled.

**Use with**: [c_limit](#c_limit)

**Learn more**: [Automatic image width](./responsive_server_side_client_hints#automatic_image_width) 

#### Syntax details
| Value          | Type    | Description                                                                                                                       |
| -------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| rounding step  | integer | Sets a new value for the rounding step (e.g.: `50`).**Default**: 100                                                              |
| fallback width | integer | The width to use in the case the actual width cannot be retrieved from the Client-Hints header (e.g.: `500`).**Default**: Not set |

#### Examples
The HTML tag to deliver an image automatically scaled to the maximum width available (`sizes=100vw`) for the image (`c_limit,w_auto`):
  
```html
<img 
    src="https://res.cloudinary.com/demo/image/upload/c_limit,w_auto/leather_bag.jpg"
    sizes="100vw"  />
```

You can create the HTML image tag above with our SDKs as follows:

```multi
|ruby
cl_image_tag("leather_bag.jpg", width: auto, client_hints: true, crop: "limit",
  sizes: "100vw") 

|php_2
ImageTag::fromParams("leather_bag.jpg",  ["width" => "auto", "client_hints" => "true",
  "crop" => "limit", "sizes" => "100vw"]);

|python
cloudinary.CloudinaryImage("leather_bag.jpg").image(width = "auto", crop = "limit",
  client_hints = True, sizes = "100vw")

|nodejs
cloudinary.image("leather_bag.jpg",  { width: "auto", client_hints: "true", crop: "limit",
  sizes: "100vw" })

|java
cloudinary.url().transformation(new Transformation().width("auto").client_hints("true").crop("limit").sizes("100vw")).imageTag("leather_bag.jpg");

|go
Not supported by this SDK
```

 

&nbsp;`w_auto:breakpoints[_<breakpoint settings>][:<fallback width>][:json]`

The width is rounded up to the nearest breakpoint, where the optimal breakpoints are calculated using either the default breakpoint request settings or using the given settings.

**Use with**: [c_limit](#c_limit)

**Learn more**: [Responsive breakpoint request settings](./image_upload_api_reference#responsive_breakpoints_parameter_request_settings)

#### Syntax details
| Value               | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| breakpoint settings | string  | The breakpoint settings can be overridden by also including new breakpoint values. All 4 of the breakpoint request settings values must be included if you need to override any of them, and must be given in the following order: `_[min_width]_[max_width]_[bytes_step_in_KBs]_[max_images]` (e.g.: `w_auto:breakpoints_200_1920_30_15`).**Defaults**: min_width=50, max_width=1000, bytes_step=20KB, max_images=20. |
| fallback width      | integer | The width to use in the case the actual width cannot be retrieved from the Client-Hints header (e.g.: `200`).**Default**: Not set                                                                                                                                                                                                                                                                                      |
| json                | keyword | If `json` is specified, it requests that Cloudinary deliver the set of calculated breakpoints as a JSON response instead of delivering the transformed image itself.                                                                                                                                                                                                                                                   |

#### Examples
The HTML tag to deliver an image filled to an aspect ratio of 16:9 (`ar_16:9,c_fill`) and then automatically scaled to the closest optimal breakpoint, where the optimal breakpoints are calculated using breakpoint request values of min_width=200, max_width=1920, bytes_step=30, and max_images=15 (`c_limit,w_auto:breakpoints_200_1920_30_15`):

```html
<img 
    src="https://res.cloudinary.com/demo/image/upload/ar_16:9,c_fill/c_limit,w_auto:breakpoints_200_1920_30_15/bike.jpg"
    sizes="100vw"  />
```

You can create the HTML image tag above with our SDKs as follows:

```multi
|ruby
cl_image_tag("bike.jpg", client_hints: true, sizes: "100vw", transformation: [
  {aspect_ratio: "16:9", crop: "fill"},
  {width: "auto:breakpoints_200_1920_30_15", crop: "limit"}])

|php_2
ImageTag::fromParams("bike.jpg", 
  ["client_hints"=>true, "sizes"=>"100vw", "transformation"=>[
    ["aspect_ratio"=>"16:9", "crop"=>"fill"],
    ["width"=>"auto:breakpoints_200_1920_30_15", "crop"=>"limit"]]])
  
|python
CloudinaryImage("bike.jpg").image(client_hints=True, sizes="100vw", transformation=[
  {"aspect_ratio": "16:9", "crop": "fill"},
  {"width": "auto:breakpoints_200_1920_30_15", "crop": "limit"}])

|nodejs
cloudinary.image("bike.jpg", {client_hints: true, sizes: "100vw", transformation: [
  {aspect_ratio: "16:9", crop: "fill"},
  {width: "auto:breakpoints_200_1920_30_15", crop: "limit"}]})

|java
cloudinary.url().transformation(new Transformation()
  .aspectRatio("16:9").crop("fill").chain()
  .width("auto:breakpoints_200_1920_30_15").crop("limit")
  .clientHints(true).sizes("100vw").imageTag("bike.jpg"))

|go
Not supported by this SDK
```

 

**Default**: 1920
mobile max | integer | The maximum width in pixels for media delivered to a smartphone device.**Default**: 828

{/collapsed}

#### Example
Deliver the `happy_people` image at a maximum width of 1500 pixels to a desktop device, or 800 pixels to a mobile device (`w_responsive:fallback-max-width_1500;fallback-max-width-mobile_800`): 

![Happy people image with limited width](https://res.cloudinary.com/demo/image/upload/c_scale,w_responsive:fallback-max-width_1500;fallback-max-width-mobile_800/happy_people.jpg "height:150")

{/actionType}  -->

## x, y (x & y coordinates)
&nbsp;`x/y_<coordinate value>`

A [qualifier](#parameter_types) that adjusts the starting location or offset of the corresponding transformation action.   

| Action                                         | Effect of x & y coordinates                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [c_crop](#c_crop)                              | The top-left coordinates of the crop (positive x = right, positive y = down).                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| [e_blur_region](#e_blur_region)                | The top-left coordinates of the blurred region (positive x = right, positive y = down).                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| [e_displace](#e_displace)                      | See [Displacement maps](./effects_and_artistic_enhancements#displacement_maps).                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [e_gradient_fade](#e_gradient_fade)            | Positive values fade from the top (y) or left (x). Negative values fade from the bottom (y) or right (x). Values between 0.0 and 1.0 indicate a percentage. Integer values indicate pixels.                                                                                                                                                                                                                                                                                                                                                            |
| [e_pixelate_region](#e_pixelate_region)        | The top-left coordinates of the pixelated region (positive x = right, positive y = down).                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| [e_shadow](#e_shadow)                          | The offset of the shadow relative to the image in pixels. Positive values offset the shadow right (x) or down (y). Negative values offset the shadow left (x) or up (y).                                                                                                                                                                                                                                                                                                                                                                               |
| [g_\<compass position\>](#g_compass_position)  | Offset the compass position, e.g. when positioning overlays:`center`, `north_west`, `north`, `west`: positive x = right, positive y = down, negative x = left, negative y = up`north_east`, `east`: positive x = left, positive y = down, negative x = right, negative y = up`south_east`: positive x = left, positive y = up, negative x = right, negative y = down`south`, `south_west`: positive x = right, positive y = up, negative x = left, negative y = down Values between 0.0 and 1.0 indicate a percentage. Integer values indicate pixels. |
| [g_xy_center](#g_special_position)             | The coordinates of the center of gravity (positive x = right, positive y = down).                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [l_layer](#l_layer)[u (underlay)](#u_underlay) | The offset of the layer according to the compass position (see above). If no compass position is specified, `center` is assumed.                                                                                                                                                                                                                                                                                                                                                                                                                       |

**Use with**: [c_crop](#c_crop) | [e_blur_region](#e_blur_region) | [e_displace](#e_displace) | [e_gradient_fade](#e_gradient_fade) | [e_pixelate_region](#e_pixelate_region) | [e_shadow](#e_shadow) | [g_\<compass position\>](#g_compass_position) | [g_\<special position\>](#g_special_position) | [l_layer](#l_layer) | [u (underlay)](#u_underlay)

**Learn more**: [Controlling gravity](./resizing_and_cropping#control_gravity) | [Placing overlays](./layers#layer_placement_gravity)

**See also**: [Arithmetic expressions](./user_defined_variables#arithmetic_expressions)

#### Syntax details
| Value            | Type                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| coordinate value | pixels &#124; float (percentage) | The starting location or offset for custom-coordinates based cropping, overlay placement and certain region related effects. Specify as a number of pixels or as a float value corresponding to a percentage in relation to 1.0. For example `0.8` is equal to a 80%. **Note**: When specifying any combination of `x`, `y`, `h` and `w`, use either integers or floats for all values.  Do not mix types. **Default**: `0`. |

#### Examples
1. Crop the image using x and y coordinates to define the starting location (`c_crop,h_150,w_150,x_80,y_30`).
![Coordinates based cropping](https://res.cloudinary.com/demo/image/upload/c_crop,h_150,w_150,x_80,y_30/face_top.jpg)
1. Position an overlay that is offset horizontally and vertically by 15% from the north east corner(`c_thumb,g_face,h_150,w_150/l_badge/c_scale,w_0.08/fl_layer_apply,g_north_east,x_0.15,y_0.15`).
![Positioning an overlay with coordinates](https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,h_150,w_150/l_badge/c_scale,w_0.08/fl_layer_apply,g_north_east,x_0.15,y_0.15/face_top.jpg)

## z (zoom)
&nbsp;`z_<zoom amount>`

A [qualifier](#parameter_types) that controls how close to crop to the detected coordinates when using face-detection, custom-coordinate, or object-specific gravity (when using the [Cloudinary AI Content Analysis addon](./cloudinary_ai_content_analysis_addon)). 

**Use with**: [c_auto](#c_auto) | [c_crop](#c_crop) | [c_thumb](#c_thumb) 

{note}

* When used with the `thumb` or `auto` resize modes, the detected coordinates are scaled to completely fill the requested dimensions and then cropped as needed.
* When used with the `crop` resize mode, the zoom qualifier has an impact only if resize dimensions (height and/or width) are **not** specified. In this case, the crop dimensions are determined by the detected coordinates and then adjusted based on the requested zoom.   

{/note}

**Learn more**: [Creating image thumbnails](./resizing_and_cropping#thumb)

**See also**: [Arithmetic expressions](./user_defined_variables#arithmetic_expressions)

#### Syntax details
| Value       | Type               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| zoom amount | float (percentage) | The amount of zoom to apply when cropping around the detected coordinates of faces, objects or custom regions.  Specify as a float value corresponding to a percentage, where 1.0 instructs to crop to the detected coordinates. Values less than one will result in a crop outside the coordinates (zoom out) and values greater than one will crop closer than the coordinates (zoom in). For example `0.8` represents a zoom amount of 80%. **Default**: `1.0`. |

#### Examples
1. Generate a 150*150 square thumbnail image using face detection with a zoom amount of 75% (`c_thumb,g_face,h_150,w_150,z_0.75`).
![Thumbnail crop with zoom of 75%](https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,h_150,w_150,z_0.75/woman_sample.jpg)
1. Crop the image based on the detected coordinates of the face, but zoom in to 120% (`c_crop,g_face,z_1.2`).
![Face detection crop with zoom of 120%](https://res.cloudinary.com/demo/image/upload/c_crop,g_face,z_1.2/woman_sample.jpg)
1. Crop the image around the sink, but zoom out to 80% before cropping (`c_crop,g_sink,z_0.8`).
![Object aware crop with zoom of 80%](https://res.cloudinary.com/demo/image/upload/c_crop,g_sink,z_0.8/docs/kitchen1.jpg "thumb: h_150")

## $ (variable)
&nbsp;`$<variable name>[_<variable value>]`

Defines and assigns values to user defined variables, so you can use the variables as values for other parameters. 

**Learn more**: [User-defined variables in image transformations](./user_defined_variables#user_defined_variables_overview) | [User-defined variables in video transformations](./video_user_defined_variables#user_defined_variables_overview) 

**See also**: [Arithmetic expressions](./user_defined_variables#arithmetic_expressions)

#### Syntax details
| Value          | Type                                               | Description                                                                                                                                                      |
| -------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| variable name  | string                                             | **Required.** The name of variable.                                                                                                                              |
| variable value | constant &#124; float &#124; integer &#124; string | **Required only when setting a variable.** The value of variable. For possible values see [Variable value types](./user_defined_variables#variable_value_types). |

#### Examples
1. Set the variables `$widthval` to `200`, and `$arval` to `0.8` (`$widthval_200/$arval_0.8`). Then set the aspect ratio parameter to the `$arval` value and the width parameter to the `$widthval` value (`ar_$arval,...,w_$widthval`), with `face`-based `fill` cropping:
![Set width and aspect ratio using variables](https://res.cloudinary.com/demo/image/upload/$widthval_200/$arval_0.8/ar_$arval,c_fill,g_face,w_$widthval/woman.jpg "thumb: h_150")
1. Define a user-defined variable called `$width` and set it to 150 pixels (`$width_150`). Then pass the value of the variable to the named transformation, `passport_photo`, which references the `$width` variable (`t_passport_photo`):
![Set width in a named transformation using a variable](https://res.cloudinary.com/demo/image/upload/$width_150/t_passport_photo/woman.jpg "thumb: dpr_2.0,h_150, height:150")
