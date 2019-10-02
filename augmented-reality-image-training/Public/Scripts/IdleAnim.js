// IdleAnim.js
// Version: 0.0.4
// Event: Lens Initialized
// Description: Plays a single looping animation on the character

//  @ui {"widget": "group_start", "label": "Idle Animation Settings"}
//  @input Component.AnimationMixer AnimationMixer
//  @input string IdleAnimLayer
//  @ui {"widget": "group_end"}

//  @input Asset.AudioTrackAsset IdleAnimAudio

var audioComponent = null;

script.api.idleAnimLayerName = script.IdleAnimLayer;
script.api.animMixer = script.AnimationMixer;
script.api.idleAnimAudio = audioComponent;

// Setup the audio component if audio track defined
function audioSetup()
{
    if(script.IdleAnimAudio && !audioComponent)
    {       
        audioComponent = script.getSceneObject().createComponent("Component.AudioComponent");
        audioComponent.audioTrack = script.IdleAnimAudio;
        script.api.idleAnimAudio = audioComponent;
    }
}
audioSetup();

function idleAnimInitFunc()
{
    if(script.AnimationMixer && script.IdleAnimLayer)
    {
        script.AnimationMixer.start(script.IdleAnimLayer, 0, -1);
        script.AnimationMixer.setWeight(script.IdleAnimLayer, 1.0);
        if (audioComponent)
        {
            audioComponent.play( -1 );
        }
    }
}
script.api.idleAnimInitFunc = idleAnimInitFunc;

script.api.idleAnimInitFunc();