const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="card w-[28rem] bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body space-y-4">
          <h2 className="card-title text-primary text-2xl font-bold">
            Welcome to BaaNudi 💬
          </h2>
          <p className="text-base-content/70">{subtitle}</p>

          {/* Chat Preview */}
          <div className="space-y-3">
            <div className="chat chat-start">
              <div className="chat-bubble bg-primary text-white">
                👋 Hi there! Welcome to <b>BaaNudi</b>.
              </div>
            </div>

            <div className="chat chat-end">
              <div className="chat-bubble bg-secondary text-white">
                Hey! What makes BaaNudi special?
              </div>
            </div>

            <div className="chat chat-start">
              <div className="chat-bubble bg-primary text-white">
                🌟 It’s your space to share, connect & discover.
              </div>
            </div>

            <div className="chat chat-end">
              <div className="chat-bubble bg-secondary text-white">
                Sounds amazing! How do I start?
              </div>
            </div>

            <div className="chat chat-start">
              <div className="chat-bubble bg-primary text-white">
                📝 Just create your free account and say <i>BaaNudi</i> to the world!
              </div>
            </div>
          </div>

          {/* Optional Call to Action */}
          <div className="mt-4 text-center">
            <span className="badge badge-primary badge-lg">Start chatting now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;
