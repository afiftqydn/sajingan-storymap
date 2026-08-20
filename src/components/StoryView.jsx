import Story from './Story.jsx';

// Tab "Cerita" — rakitan MapController + Story (scroll) + StepIndicator.
// Story.jsx sudah merangkai semuanya; komponen ini titik masuk sederhana
// supaya App.jsx tidak perlu tahu detail internal.
export default function StoryView() {
  return <Story />;
}
