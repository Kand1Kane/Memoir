import google.generativeai as genai

API_KEY = "AIzaSyAyz1qqlgKQhujbxtxOG11HBmT5F6enCEg"
genai.configure(api_key=API_KEY)
# The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts

class Gemini:
    def __init__(self, ):
        self.model = genai.GenerativeModel(model_name='gemini-2.0-flash')
        self.summarzie_instruction = """Summarize the conversation in 3 bullet points to remember what conversation I've had."""

    def summarize(self, user_prompt):
        system_instruction = self.summarzie_instruction
        user_prompt = system_instruction + "\n\n Conversation: " + user_prompt
        response = self.model.generate_content(
            contents=user_prompt,
            generation_config=genai.types.GenerationConfig(
            # Only one candidate for now.
            candidate_count=1,
            max_output_tokens=10000,
            temperature=1.0,)
        )
        return response
    
agent = Gemini()

def get_llm(prompt):
    return agent.summarize(user_prompt=prompt)
    
if __name__ == "__main__":
    Generator = Gemini()
    prompts = """Hey, I’ve been thinking about switching careers lately. My current job pays well, but I just don’t feel fulfilled anymore.

    Wow, that’s a big decision. What’s been bothering you about it?

    I guess it's the lack of creativity. I feel like I’m just going through the motions. I’ve always wanted to do something more meaningful—maybe something related to education or mental health.

    That makes a lot of sense. You’ve always been passionate about helping people. Have you looked into any specific paths?

    Yeah, I’ve been researching programs for becoming a licensed counselor. It’s a long road, and it would mean going back to school, possibly part-time while I keep working.

    That’s a lot to take on, but it sounds like it could be really rewarding. Do you have a timeline in mind?

    Ideally, I’d start classes next spring. But I’m still torn. What if I invest all this time and money and it doesn’t work out?

    Totally understandable. But isn’t it more painful to stay stuck doing something that makes you feel unfulfilled? You don’t have to have everything figured out right now—just take the next step.

    True. I’m going to talk to someone who’s already in the field and get their perspective. Maybe that’ll give me some clarity.

    That’s a great idea. And no matter what you choose, I’m here for you. You’ve got this.

    Thanks. You always know how to calm me down. I’ll keep you posted."""

    gen_result = Generator.summarize(user_prompt=prompts)

    print("\n\n")

    print(f"Summary of Conversation: {gen_result.text}")