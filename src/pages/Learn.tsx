import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, Check, ChevronDown, ChevronUp, 
  Lightbulb, Trophy, Sparkles, BookOpen, 
  Target, GraduationCap, Zap, Play 
} from 'lucide-react'
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore'
import { firebaseConfigured, getFirestoreDb } from '../lib/firebase'
import { useAuth } from '../lib/AuthContext'

interface Question {
  q: string
  options: string[]
  answer: number
  hint: string
}

interface Lesson {
  id: string
  title: string
  desc: string
  rule: string
  example: string
  xp: number
  questions: Question[]
  gameUrl: string
}

interface Module {
  id: string
  title: string
  level: string
  icon: any
  color: string
  lessons: Lesson[]
}

// 16 Detailed Lessons across 4 Modules
const curriculum: Module[] = [
  {
    id: 'mod_1',
    title: 'The Foundations',
    level: 'BEGINNER',
    icon: BookOpen,
    color: '#3b82f6', // PROMNEXA Blue
    lessons: [
      {
        id: 'lesson_01',
        title: 'The Core 4-Part Formula',
        desc: 'Learn the exact order of words the AI expects to see.',
        rule: 'Always use this structure: [Subject + Action] + [Setting] + [Lighting] + [Style/Medium]',
        example: 'A cybernetic ronin drinking tea (Subject) inside a neon diner (Setting), moody cinematic lighting (Lighting), 35mm film photography (Style).',
        xp: 40,
        questions: [
          {
            q: 'Where should your main subject be placed in your prompt?',
            options: ['At the very end of the sentence', 'In the first 5 to 8 words', 'Anywhere, order does not matter'],
            answer: 1,
            hint: 'AI models assign the highest priority to the very first words they read.'
          },
          {
            q: 'What is the purpose of the "Setting" in the formula?',
            options: ['It tells the AI what camera to use', 'It defines the location, time, and world around the subject', 'It changes the color of the subject’s clothes'],
            answer: 1,
            hint: 'Setting is the environment—where and when the image takes place.'
          },
          {
            q: 'Which is the best example of a "Style" tag?',
            options: ['"Standing in a dark room"', '"Wearing a red jacket"', '"Oil painting with thick brushstrokes"'],
            answer: 2,
            hint: 'Style defines the art medium (e.g., photo, 3D render, painting).'
          }
        ],
        gameUrl: '/games/freestyle'
      },
      {
        id: 'lesson_02',
        title: 'Drop the Buzzwords',
        desc: 'Why words like "photorealistic" and "8K" ruin your images.',
        rule: 'Describe physical materials and textures instead of telling the AI to make it "high quality".',
        example: 'Instead of "super realistic masterpiece", use: "worn full-grain leather, brass buckles, frayed threads, dusty glass".',
        xp: 40,
        questions: [
          {
            q: 'Why should you avoid words like "trending on ArtStation" or "hyperrealistic"?',
            options: ['They cause the AI to crash', 'They are vague buzzwords that usually create a fake, plastic look', 'They make the image file size too large'],
            answer: 1,
            hint: 'Modern AI prefers real physical descriptions over generic praise words.'
          },
          {
            q: 'Which phrase is better for creating a realistic metal object?',
            options: ['"Best quality ultra 8k graphic metal"', '"Masterpiece level high resolution steel"', '"Brushed stainless steel with visible scratches and water droplets"'],
            answer: 2,
            hint: 'Real objects have physical imperfections like scratches and moisture.'
          },
          {
            q: 'If you want a highly detailed face, what should you describe?',
            options: ['"Insanely detailed face masterpiece"', '"Skin pores, subtle freckles, fine peach fuzz, natural skin texture"', '"16k resolution facial features"'],
            answer: 1,
            hint: 'Name the actual microscopic details of human skin.'
          }
        ],
        gameUrl: '/games/repair'
      },
      {
        id: 'lesson_03',
        title: 'Subject Specificity',
        desc: 'How to make your main character stand out clearly.',
        rule: 'Don’t just say "a man". Describe their age, clothing, posture, and facial expression.',
        example: 'An elderly fisherman with a weathered face, wearing a bright yellow raincoat, looking exhausted but proud.',
        xp: 40,
        questions: [
          {
            q: 'Which subject description gives the AI the clearest instruction?',
            options: ['"A nice looking dog"', '"A golden retriever puppy with muddy paws chewing a stick"', '"A highly detailed dog graphic"'],
            answer: 1,
            hint: 'Specific actions and physical traits give the AI concrete things to draw.'
          },
          {
            q: 'How should you describe clothing for the best results?',
            options: ['Name the fabric material, color, and fit (e.g., loose silk crimson robe)', 'Just say "nice clothes"', 'Let the AI guess by leaving it blank'],
            answer: 0,
            hint: 'Fabric types (silk, denim, leather) change how light reflects off the character.'
          },
          {
            q: 'Why is defining a specific facial expression important?',
            options: ['It changes the background color', 'It prevents the AI from generating a blank, default stare', 'It makes the prompt shorter'],
            answer: 1,
            hint: 'Without guidance, AI defaults to a neutral, lifeless expression.'
          }
        ],
        gameUrl: '/games/freestyle'
      },
      {
        id: 'lesson_04',
        title: 'Setting the Scene',
        desc: 'Grounding your subject in a believable world.',
        rule: 'Always establish the time of day and the specific location.',
        example: 'Midnight in a cyberpunk alleyway, neon signs reflecting in rain puddles, heavy smog.',
        xp: 40,
        questions: [
          {
            q: 'What does specifying the "time of day" do to your image?',
            options: ['It puts a clock in the background', 'It drastically changes the sky color and ambient lighting', 'It only works for outdoor scenes'],
            answer: 1,
            hint: 'Dawn, noon, golden hour, and midnight all have completely different color palettes.'
          },
          {
            q: 'Which setting is the most descriptive?',
            options: ['"A city street"', '"A crowded futuristic neon market at dusk"', '"Outside in the world"'],
            answer: 1,
            hint: 'Combine location, time, and atmosphere (crowded, neon) for a rich setting.'
          },
          {
            q: 'How do you add atmosphere to a setting?',
            options: ['Include weather or air conditions like "dense fog" or "heavy rain"', 'Type the word "atmosphere"', 'Use all caps'],
            answer: 0,
            hint: 'Weather elements add depth and mood to the environment.'
          }
        ],
        gameUrl: '/games/rebuild'
      }
    ]
  },
  {
    id: 'mod_2',
    title: 'Directing the Scene',
    level: 'INTERMEDIATE',
    icon: Target,
    color: '#8b5cf6', // PROMNEXA Violet
    lessons: [
      {
        id: 'lesson_05',
        title: 'Lighting & Mood',
        desc: 'Light defines depth, volume, and the emotion of your image.',
        rule: 'Always name the light source, its direction, and its color.',
        example: 'Soft morning sunlight shining from the left, casting long shadows, warm golden tone.',
        xp: 60,
        questions: [
          {
            q: 'What does "rim lighting" (or backlighting) do to a character?',
            options: ['It draws a glowing outline around their edges, separating them from the background', 'It makes the entire image black and white', 'It removes all shadows'],
            answer: 0,
            hint: 'Rim light shines from directly behind the subject.'
          },
          {
            q: 'How do you create visible beams or shafts of light?',
            options: ['Add the words: "volumetric lighting with dust motes or mist"', 'Write: "make the light brighter 100%"', 'Specify: "high contrast saturated colors"'],
            answer: 0,
            hint: 'Light shafts need an atmosphere (like mist, smoke, or dust) to reflect off.'
          },
          {
            q: 'Which lighting creates a dramatic, moody, and intense portrait?',
            options: ['"Flat even lighting"', '"Harsh directional lighting with deep shadows (chiaroscuro)"', '"No lighting"'],
            answer: 1,
            hint: 'Harsh contrast between light and dark creates drama.'
          }
        ],
        gameUrl: '/games/freestyle'
      },
      {
        id: 'lesson_06',
        title: 'Camera Angles',
        desc: 'Take control of the camera instead of accepting boring, centered shots.',
        rule: 'Tell the model the height angle (Low, High, Eye-level, Overhead).',
        example: 'Extreme low-angle shot, looking up at a towering skyscraper, making it look massive and intimidating.',
        xp: 60,
        questions: [
          {
            q: 'What camera angle makes a subject appear heroic, massive, and powerful?',
            options: ['Bird’s-eye overhead shot looking down', 'Low-angle shot looking up at the subject', 'Flat lay desk perspective'],
            answer: 1,
            hint: 'Looking up from a low angle exaggerates the subject’s height and stature.'
          },
          {
            q: 'What is a "Dutch angle"?',
            options: ['A photo taken in the Netherlands', 'A shot where the camera is tilted sideways, creating unease or action', 'A perfectly straight, flat photo'],
            answer: 1,
            hint: 'Tilting the horizon line creates a sense of motion or psychological tension.'
          },
          {
            q: 'Which angle is best for showing a map, a tabletop, or a city layout?',
            options: ['Worm’s-eye view', 'Overhead drone shot / Top-down view', 'Close-up profile'],
            answer: 1,
            hint: 'Looking straight down reveals the layout of flat surfaces.'
          }
        ],
        gameUrl: '/games/rebuild'
      },
      {
        id: 'lesson_07',
        title: 'Lenses & Focus',
        desc: 'Control depth of field and framing using real photography terms.',
        rule: 'Use focal lengths (mm) to control how much background you see and how blurry it is.',
        example: '85mm portrait lens at f/1.8, keeping the subject’s face sharp while the background melts into soft bokeh.',
        xp: 60,
        questions: [
          {
            q: 'Which lens type is best for creating a blurry background (bokeh) behind a face?',
            options: ['14mm ultra-wide fisheye', '85mm telephoto portrait lens at f/1.8', 'Standard smartphone camera lens'],
            answer: 1,
            hint: 'Telephoto lenses (85mm–135mm) with wide apertures (like f/1.8) isolate subjects beautifully.'
          },
          {
            q: 'If you want to capture a massive landscape showing mountains and a whole valley, what lens is best?',
            options: ['200mm macro lens', '16mm wide-angle lens', '50mm standard lens'],
            answer: 1,
            hint: 'Wide-angle lenses (under 35mm) capture a huge field of view.'
          },
          {
            q: 'What does a "Macro" lens do?',
            options: ['Takes pictures of galaxies', 'Takes extreme close-ups of tiny details like insect eyes or water drops', 'Makes the image black and white'],
            answer: 1,
            hint: 'Macro photography is for extreme close-ups of very small subjects.'
          }
        ],
        gameUrl: '/games/detective'
      },
      {
        id: 'lesson_08',
        title: 'Action & Motion',
        desc: 'Capture dynamic movement instead of stiff poses.',
        rule: 'Use active verbs and describe the physics of the movement (wind, debris, motion blur).',
        example: 'A dancer caught mid-leap, flowing silk dress trailing behind her, motion blur on her feet, dust kicking up from the floor.',
        xp: 60,
        questions: [
          {
            q: 'How do you prevent a character from looking like a stiff statue?',
            options: ['Use words like "standing still"', 'Describe an action in progress, like "mid-jump" or "swinging a sword"', 'Don’t mention their body at all'],
            answer: 1,
            hint: 'Action phases (mid-leap, mid-stride) force the AI to draw dynamic poses.'
          },
          {
            q: 'What visual effect helps convey fast speed in a still image?',
            options: ['Motion blur on the background', 'Perfectly sharp focus everywhere', 'A solid white background'],
            answer: 0,
            hint: 'Cameras capture fast movement as a directional blur.'
          },
          {
            q: 'How does clothing help show movement?',
            options: ['It doesn’t', 'By describing it as "flowing, blowing in the wind, or trailing behind"', 'By making it tight'],
            answer: 1,
            hint: 'Fabric reacts to physics and wind, creating visual flow lines.'
          }
        ],
        gameUrl: '/games/repair'
      }
    ]
  },
  {
    id: 'mod_3',
    title: 'Advanced Control',
    level: 'ADVANCED',
    icon: Zap,
    color: '#e11d48', // PROMNEXA Crimson
    lessons: [
      {
        id: 'lesson_09',
        title: 'Spatial Depth & Staging',
        desc: 'Prevent multiple characters from melting into a single messy shape.',
        rule: 'Divide multi-subject prompts into three zones: Foreground, Midground, and Background.',
        example: 'Foreground: a weathered wooden fence. Midground: a traveler resting. Background: misty snowy mountain peaks.',
        xp: 80,
        questions: [
          {
            q: 'How do you prevent two characters in a prompt from merging their clothes or faces?',
            options: ['Type the word "separate" ten times', 'Assign each character to distinct positions (e.g. left vs right) or separate depth planes', 'Put both characters inside quotes'],
            answer: 1,
            hint: 'Explicit spatial positioning gives the AI distinct regions to focus on.'
          },
          {
            q: 'Why should you include a "foreground" element in a landscape shot?',
            options: ['It creates 3D depth and scale, leading the viewer’s eye into the scene', 'It hides rendering mistakes made by the AI', 'It makes the image generate faster'],
            answer: 0,
            hint: 'Objects close to the camera (foreground) establish size and perspective for the whole image.'
          },
          {
            q: 'What is the "Midground" usually used for?',
            options: ['The sky', 'The primary subject or action of the scene', 'The object closest to the lens'],
            answer: 1,
            hint: 'The midground is the focal point where the main story happens.'
          }
        ],
        gameUrl: '/games/freestyle'
      },
      {
        id: 'lesson_10',
        title: 'Negative Prompting',
        desc: 'How to reliably remove unwanted elements and mutations.',
        rule: 'Never write words like "no" or "without" in the main prompt. Use a separate Negative Prompt box.',
        example: 'Positive: "Peaceful village square" | Negative: "cars, vehicles, asphalt, crowds, blurry, text, signatures".',
        xp: 80,
        questions: [
          {
            q: 'Why is typing "a beach with NO people" a mistake in a normal prompt?',
            options: ['AI text encoders focus on the noun "people" and will usually draw them anyway', 'It is against the content safety filter', 'It forces the image to render in low resolution'],
            answer: 0,
            hint: 'AI struggles with negative words like "no". It just sees the object you typed.'
          },
          {
            q: 'What is the true job of a Negative Prompt?',
            options: ['To steer the AI away from specific visual defects, artifacts, or unwanted objects', 'To generate a dark, scary version of your prompt', 'To delete images from your gallery'],
            answer: 0,
            hint: 'Negative prompts act as a repellent against things you don’t want to see.'
          },
          {
            q: 'If the AI keeps drawing deformed hands, what should you put in the Negative Prompt?',
            options: ['"Good hands"', '"Mutated hands, extra fingers, malformed limbs, bad anatomy"', '"Draw the hands perfectly"'],
            answer: 1,
            hint: 'List the exact defects you want to avoid in the negative box.'
          }
        ],
        gameUrl: '/games/repair'
      },
      {
        id: 'lesson_11',
        title: 'Style Synthesis',
        desc: 'Prevent muddy textures by choosing one clear art medium.',
        rule: 'Never mix conflicting mediums (like "photo and oil painting"). Pick one and use its real craft techniques.',
        example: 'Instead of "watercolor 3D render", use: "watercolor, wet-on-wet paint bleed, soft color washes, rough cold-pressed paper".',
        xp: 80,
        questions: [
          {
            q: 'What happens when you combine opposing styles like "oil painting 3D render photograph"?',
            options: ['The AI creates 3 separate images in a collage', 'The styles conflict, making the textures muddy and creating strange visual artifacts', 'The prompt renders in half the time'],
            answer: 1,
            hint: 'Contradictory styles cancel each other out, leading to synthetic, ugly distortion.'
          },
          {
            q: 'How do you force the AI to make an authentic-looking watercolor painting?',
            options: ['Type: "Octane render with raytracing"', 'Type: "Wet-on-wet paint bleed, soft color washes, rough textured paper edges"', 'Type: "Vector logo icon with clean borders"'],
            answer: 1,
            hint: 'Describe the real-world physical techniques and materials of watercolor art.'
          },
          {
            q: 'To create a clean, modern digital illustration, which keywords work best?',
            options: ['"Grainy film, light leaks, polaroid"', '"Crisp vector graphics, flat colors, minimalist UI art style"', '"Thick impasto palette knife strokes"'],
            answer: 1,
            hint: 'Vectors and flat colors define modern digital graphics.'
          }
        ],
        gameUrl: '/games/detective'
      },
      {
        id: 'lesson_12',
        title: 'Color Theory & Palettes',
        desc: 'Take control of the color grading.',
        rule: 'Specify a color palette (e.g., Monochromatic, Complementary, Pastel) to unify the image.',
        example: 'A futuristic city, cyberpunk neon color palette, dominant cyan and magenta hues, stark black shadows.',
        xp: 80,
        questions: [
          {
            q: 'What is a "Complementary" color palette?',
            options: ['Colors that are opposite each other on the color wheel (e.g., Teal and Orange)', 'All shades of gray', 'Random colors mixed together'],
            answer: 0,
            hint: 'Opposite colors create high contrast and cinematic appeal.'
          },
          {
            q: 'If you want a soft, dreamy, and gentle image, what palette should you use?',
            options: ['"High contrast neon"', '"Muted pastel colors, soft whites, baby blues"', '"Grayscale halftone"'],
            answer: 1,
            hint: 'Pastels are soft, desaturated colors that feel calm.'
          },
          {
            q: 'What does "Monochromatic" mean in prompting?',
            options: ['Using only variations of a single color', 'Using every color in the rainbow', 'Making it transparent'],
            answer: 0,
            hint: 'Mono means one, chroma means color.'
          }
        ],
        gameUrl: '/games/freestyle'
      }
    ]
  },
  {
    id: 'mod_4',
    title: 'The Masterclass',
    level: 'EXPERT',
    icon: GraduationCap,
    color: '#f59e0b', // PROMNEXA Gold
    lessons: [
      {
        id: 'lesson_13',
        title: 'Reverse Engineering',
        desc: 'How to decode any reference image and guess its prompt.',
        rule: 'Inspect 4 clues in order: Light angle -> Material finish -> Lens distance -> Color palette.',
        example: 'Notice a hard shadow cast to the right? Light is from the left. Soft background? Telephoto lens. Matte texture? Film stock.',
        xp: 100,
        questions: [
          {
            q: 'How can you identify what kind of lighting was used in a reference image?',
            options: ['By checking the image resolution in pixels', 'By inspecting the angle, hardness, and color of the cast shadows', 'By looking at the author signature'],
            answer: 1,
            hint: 'Shadow angles reveal where the light is placed. Soft shadow edges mean the light was soft/diffused.'
          },
          {
            q: 'When playing "Prompt Detective", how can you easily guess the camera perspective?',
            options: ['By looking at where the horizon line is (high, low, or level) relative to the subject', 'By looking at the file extension', 'By counting the number of colors in the image'],
            answer: 0,
            hint: 'A low horizon line means the camera was pointing up (low angle).'
          },
          {
            q: 'If an image has lots of grain, light leaks, and a slightly washed-out look, what is the style?',
            options: ['"Clean 3D Render"', '"Vintage 35mm analog film photography"', '"Oil painting"'],
            answer: 1,
            hint: 'Film photography has distinct analog artifacts like grain and light leaks.'
          }
        ],
        gameUrl: '/games/detective'
      },
      {
        id: 'lesson_14',
        title: 'Syntax & Weighting',
        desc: 'Force the AI to pay attention to specific words.',
        rule: 'Use brackets or numerical weights (depending on the AI engine) to emphasize a keyword.',
        example: 'A portrait of a (glowing blue eyes:1.5) warrior. The parentheses and numbers multiply the AI’s focus on the eyes.',
        xp: 100,
        questions: [
          {
            q: 'What happens when you put a word in parentheses like this: (huge sword)?',
            options: ['It hides the sword from the image', 'It increases the AI’s attention weight on that specific word', 'It makes the sword invisible'],
            answer: 1,
            hint: 'Parentheses act as a multiplier for emphasis.'
          },
          {
            q: 'If the AI is ignoring the color of a jacket, what should you do?',
            options: ['Move the jacket description to the very front of the prompt and add emphasis weights', 'Delete the prompt entirely', 'Type the word "jacket" 50 times at the end'],
            answer: 0,
            hint: 'Front-loading and weighting are the best ways to force attention.'
          },
          {
            q: 'Can you use negative weights?',
            options: ['Yes, in some engines, putting [brackets] or negative numbers reduces the presence of a feature', 'No, AI only understands positive numbers', 'Yes, but it shuts down the server'],
            answer: 0,
            hint: 'Negative weighting pushes features away without entirely removing them.'
          }
        ],
        gameUrl: '/games/repair'
      },
      {
        id: 'lesson_15',
        title: 'Abstract & Conceptual',
        desc: 'Visualizing emotions and impossible ideas.',
        rule: 'Combine an intangible concept with a physical anchor object.',
        example: 'Instead of just "sadness", write: "The embodiment of sadness, depicted as a solitary figure dissolving into dark blue ash in the rain".',
        xp: 100,
        questions: [
          {
            q: 'Why does the AI struggle with a prompt that just says "Hope"?',
            options: ['"Hope" is an abstract concept; the AI needs physical, visual metaphors to draw it', '"Hope" is filtered by safety settings', '"Hope" is too long of a word'],
            answer: 0,
            hint: 'AI draws pixels based on physical descriptions. It needs a metaphor (like a glowing light in darkness).'
          },
          {
            q: 'Which prompt best visualizes "Anxiety"?',
            options: ['"A picture of anxiety"', '"A surreal painting of a person tangled in heavy, dark, thorny vines, claustrophobic framing, chaotic lines"', '"Make it anxious"'],
            answer: 1,
            hint: 'Use physical descriptors (thorny vines, chaotic lines) to represent the feeling.'
          },
          {
            q: 'What is surrealism?',
            options: ['Taking normal photos of boring things', 'Blending dream-like, impossible elements in a realistic way (e.g. a melting clock)', 'Only using black and white'],
            answer: 1,
            hint: 'Surrealism mixes reality with dreams.'
          }
        ],
        gameUrl: '/games/freestyle'
      },
      {
        id: 'lesson_16',
        title: 'Character Consistency',
        desc: 'How to make the same character across multiple prompts.',
        rule: 'Use a specific "Seed" number and lock in 4 immutable visual anchors.',
        example: 'Use the same seed, and always include: "Emerald green eyes, scarred left cheek, braided red hair, silver jacket".',
        xp: 100,
        questions: [
          {
            q: 'What is a generation "Seed"?',
            options: ['A type of plant in the background', 'A specific starting noise pattern number that helps the AI generate identical starting points', 'The password to your account'],
            answer: 1,
            hint: 'Keeping the seed number the same drastically reduces randomness between generations.'
          },
          {
            q: 'What is a "visual anchor"?',
            options: ['A boat part', 'A highly specific, unchanging physical trait (like a facial scar or distinct clothing) that defines the character', 'The background color'],
            answer: 1,
            hint: 'Anchors trick the AI into rebuilding the same facial structure.'
          },
          {
            q: 'If your character’s face keeps changing slightly, what should you do?',
            options: ['Use a celebrity name blend (e.g., "blend of Brad Pitt and Idris Elba") as a structural base', 'Just keep clicking generate and hope', 'Delete the setting'],
            answer: 0,
            hint: 'Blending specific known faces gives the AI a rigid mathematical framework for the face.'
          }
        ],
        gameUrl: '/games/rebuild'
      }
    ]
  }
]

export default function Learn() {
  const { user } = useAuth()
  const [completed, setCompleted] = useState<string[]>([])
  const [openLesson, setOpenLesson] = useState<string | null>('lesson_01')
  
  // Track selected answers per lesson: { [lessonId]: { [questionIdx]: selectedOptionIdx } }
  const [userChoices, setUserChoices] = useState<Record<string, Record<number, number>>>({})
  
  // Feedback status per lesson: 'all_correct' | 'has_errors' | null
  const [lessonFeedback, setLessonFeedback] = useState<Record<string, 'all_correct' | 'has_errors'>>({})

  useEffect(() => {
    async function loadProgress() {
      if (!user?.uid) return
      try {
        const snap = await getDoc(doc(getFirestoreDb(), 'users', user.uid))
        if (snap.exists()) {
          // Safely fallback to empty array to prevent bugs
          setCompleted(snap.data()?.completedLessons || [])
        } else {
          setCompleted([])
        }
      } catch (e) {
        console.warn('Could not load academy progress:', e)
      }
    }
    loadProgress()
  }, [user])

  const selectOption = (lessonId: string, qIdx: number, optionIdx: number) => {
    if (completed.includes(lessonId)) return // Lock if already completed
    
    setUserChoices(prev => ({
      ...prev,
      [lessonId]: {
        ...(prev[lessonId] || {}),
        [qIdx]: optionIdx
      }
    }))
    
    // Clear feedback if they change an answer
    setLessonFeedback(prev => {
      const next = { ...prev }
      delete next[lessonId]
      return next
    })
  }

  const checkLessonQuiz = async (lesson: Lesson) => {
    const choices = userChoices[lesson.id] || {}
    const totalQuestions = lesson.questions.length

    // 1. Strict Bug Fix: Check if every single question actually has an answer selected
    const answeredCount = Object.keys(choices).length
    if (answeredCount < totalQuestions) return

    // 2. Strict Verification: Every choice must exactly match the answer index
    const allCorrect = lesson.questions.every((q, idx) => choices[idx] === q.answer)

    if (allCorrect) {
      setLessonFeedback(prev => ({ ...prev, [lesson.id]: 'all_correct' }))
      
      // Prevent duplicate completion triggers
      if (!completed.includes(lesson.id)) {
        setCompleted(prev => [...prev, lesson.id])
        
        if (user?.uid && firebaseConfigured) {
          try {
            await updateDoc(doc(getFirestoreDb(), 'users', user.uid), {
              completedLessons: arrayUnion(lesson.id),
              xp: increment(lesson.xp)
            })
          } catch (err) {
            console.error('Failed to save lesson XP:', err)
          }
        }
      }
    } else {
      setLessonFeedback(prev => ({ ...prev, [lesson.id]: 'has_errors' }))
    }
  }

  // Calculate overall progress across all modules
  const totalLessons = curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0)
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completed.length / totalLessons) * 100)

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px', color: '#fff' }}>
      
      {/* Header & Overall Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(225, 29, 72, 0.12)', border: '1px solid rgba(225, 29, 72, 0.25)', padding: '6px 14px', borderRadius: '30px', fontSize: '12px', color: '#fb7185', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '14px' }}>
            <GraduationCap size={15} /> PROMNEXA ACADEMY
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Visual <span style={{ color: '#e11d48' }}>Engineering.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0, maxWidth: '500px', lineHeight: 1.6 }}>
            Master the art of prompting from absolute beginner concepts to advanced spatial control. Pass checkpoints to earn XP and climb the leaderboard.
          </p>
        </div>

        {/* Progress Card */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px 24px', minWidth: '260px', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Syllabus Progress</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#e11d48' }}>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #f43f5e, #e11d48)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
            <Trophy size={14} style={{ display: 'inline', marginRight: '6px', color: '#facc15', verticalAlign: '-2px' }} />
            {completed.length} of {totalLessons} lessons mastered
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '45px' }}>
        {curriculum.map((mod, modIdx) => {
          const ModIcon = mod.icon
          
          return (
            <div key={mod.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Module Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                <div style={{ background: `${mod.color}15`, color: mod.color, width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${mod.color}30` }}>
                  <ModIcon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: mod.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
                    MODULE 0{modIdx + 1} — {mod.level}
                  </div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#fff' }}>{mod.title}</h2>
                </div>
              </div>

              {/* Lessons within Module */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mod.lessons.map((lesson, lessonIdx) => {
                  const isOpen = openLesson === lesson.id
                  const isDone = completed.includes(lesson.id)
                  const choices = userChoices[lesson.id] || {}
                  const feedbackStatus = lessonFeedback[lesson.id]
                  const allAnswered = Object.keys(choices).length === lesson.questions.length

                  return (
                    <article 
                      key={lesson.id} 
                      style={{ 
                        background: isOpen ? 'rgba(30, 41, 59, 0.4)' : 'rgba(15, 23, 42, 0.4)', 
                        border: isOpen ? `1px solid ${mod.color}40` : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Collapsible Header */}
                      <div 
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '18px 24px', gap: '16px' }}
                        onClick={() => setOpenLesson(isOpen ? null : lesson.id)}
                      >
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '50%', 
                          background: isDone ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)', 
                          color: isDone ? '#4ade80' : 'rgba(255,255,255,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '13px', border: isDone ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent'
                        }}>
                          {isDone ? <Check size={16} /> : `${modIdx + 1}.${lessonIdx + 1}`}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: isDone ? '#fff' : 'rgba(255,255,255,0.9)' }}>
                            {lesson.title}
                          </h3>
                          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                            {lesson.desc}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: isDone ? '#4ade80' : mod.color, background: isDone ? 'transparent' : `${mod.color}15`, padding: '4px 10px', borderRadius: '20px' }}>
                            {isDone ? 'COMPLETED' : `+${lesson.xp} XP`}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Lesson Body */}
                      {isOpen && (
                        <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '24px' }}>
                            
                            {/* Left: Concept & Example */}
                            <div>
                              {/* Rule Box */}
                              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '16px', borderLeft: `3px solid ${mod.color}` }}>
                                <b style={{ color: mod.color, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                  <Lightbulb size={14} /> The Golden Rule
                                </b>
                                <p style={{ margin: 0, fontSize: '14px', color: '#e2e8f0', lineHeight: 1.6 }}>
                                  {lesson.rule}
                                </p>
                              </div>

                              {/* Concrete Example */}
                              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <b style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  Concrete Example
                                </b>
                                <div style={{ fontFamily: 'monospace', fontSize: '13px', color: mod.color, lineHeight: 1.6, background: `${mod.color}0A`, padding: '12px', borderRadius: '8px' }}>
                                  "{lesson.example}"
                                </div>
                              </div>
                            </div>

                            {/* Right: Interactive Quiz */}
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <span style={{ fontSize: '11px', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase' }}>
                                  Checkpoint Quiz ({lesson.questions.length})
                                </span>
                                {isDone && (
                                  <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Check size={14} /> PASSED (+{lesson.xp} XP)
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '20px' }}>
                                {lesson.questions.map((q, qIdx) => {
                                  const selectedOpt = choices[qIdx]
                                  const isQuestionCorrect = selectedOpt === q.answer
                                  const showState = feedbackStatus !== undefined || isDone

                                  return (
                                    <div key={qIdx}>
                                      <p style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#f8fafc', lineHeight: 1.5 }}>
                                        {qIdx + 1}. {q.q}
                                      </p>

                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {q.options.map((opt, optIdx) => {
                                          const isSelected = selectedOpt === optIdx
                                          const isCorrectChoice = optIdx === q.answer
                                          
                                          // Dynamic styling for feedback
                                          let btnBg = 'rgba(255,255,255,0.03)'
                                          let btnBorder = 'rgba(255,255,255,0.08)'
                                          let btnColor = 'rgba(255,255,255,0.7)'

                                          if (isSelected) {
                                            btnBg = 'rgba(255,255,255,0.1)'
                                            btnBorder = 'rgba(255,255,255,0.3)'
                                            btnColor = '#fff'
                                          }

                                          if (showState && isCorrectChoice && (isSelected || isDone)) {
                                            btnBg = 'rgba(34, 197, 94, 0.15)'
                                            btnBorder = '#4ade80'
                                            btnColor = '#fff'
                                          } else if (showState && isSelected && !isCorrectChoice) {
                                            btnBg = 'rgba(239, 68, 68, 0.15)'
                                            btnBorder = '#ef4444'
                                            btnColor = '#fff'
                                          }

                                          return (
                                            <button
                                              key={optIdx}
                                              type="button"
                                              style={{ 
                                                textAlign: 'left', 
                                                padding: '12px 14px', 
                                                fontSize: '13px',
                                                background: btnBg,
                                                border: `1px solid ${btnBorder}`,
                                                color: btnColor,
                                                borderRadius: '8px',
                                                cursor: isDone ? 'default' : 'pointer',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                gap: '12px',
                                                alignItems: 'flex-start',
                                                lineHeight: 1.4
                                              }}
                                              onClick={() => selectOption(lesson.id, qIdx, optIdx)}
                                              disabled={isDone}
                                            >
                                              <span style={{ fontWeight: 700, opacity: 0.5 }}>{String.fromCharCode(65 + optIdx)}.</span> 
                                              <span style={{ flex: 1 }}>{opt}</span>
                                            </button>
                                          )
                                        })}
                                      </div>

                                      {/* Hint if wrong */}
                                      {showState && !isQuestionCorrect && !isDone && (
                                        <div style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                          <Lightbulb size={14} color="#f87171" style={{ marginTop: '2px', flexShrink: 0 }} />
                                          <span style={{ fontSize: '12px', color: '#fca5a5', lineHeight: 1.5 }}>
                                            <b>Hint:</b> {q.hint}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>

                              {/* Action Bar */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <button
                                  style={{
                                    background: isDone ? 'rgba(34,197,94,0.15)' : (allAnswered ? mod.color : 'rgba(255,255,255,0.05)'),
                                    color: isDone ? '#4ade80' : (allAnswered ? '#fff' : 'rgba(255,255,255,0.3)'),
                                    border: isDone ? '1px solid rgba(34,197,94,0.3)' : 'none',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    cursor: (allAnswered && !isDone) ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onClick={() => checkLessonQuiz(lesson)}
                                  disabled={!allAnswered || isDone}
                                >
                                  {isDone ? 'XP Claimed' : 'Check Answers & Claim XP'}
                                </button>

                                <Link 
                                  to={lesson.gameUrl} 
                                  style={{ 
                                    display: 'flex', alignItems: 'center', gap: '6px', 
                                    color: mod.color, fontSize: '13px', fontWeight: 700, textDecoration: 'none' 
                                  }}
                                >
                                  Practice Mode <Play size={14} />
                                </Link>
                              </div>

                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}