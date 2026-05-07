import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Workbench } from './components/Workbench/Workbench';
import { TaskBoard } from './components/TaskBoard/TaskBoard';
import { DocumentEditor } from './components/DocumentEditor/DocumentEditor';

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Workbench />}>
            <Route index element={<TaskBoard />} />
            <Route path="editor/:id" element={<DocumentEditor />} />
            <Route path="editor/new" element={<DocumentEditor />} />
          </Route>
        </Routes>
      </HashRouter>
    </DndProvider>
  );
}
