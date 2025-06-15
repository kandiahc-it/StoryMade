import React, { useMemo } from 'react';
import { 
  ReactFlow, 
  Node, 
  Edge, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Story } from '../types/story';
import { StoryNode } from './StoryNode';

interface StoryTimelineProps {
  stories: Story[];
  rootStoryId: string;
}

const nodeTypes = {
  storyNode: StoryNode,
};

export function StoryTimeline({ stories, rootStoryId }: StoryTimelineProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const storyMap = new Map(stories.map(story => [story.id, story]));
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Build tree structure
    const buildTree = (storyId: string, level: number = 0, parentX: number = 0): number => {
      const story = storyMap.get(storyId);
      if (!story) return parentX;
      
      const children = stories.filter(s => s.parentId === storyId);
      const isHighlighted = story.votes >= 20; // Highlight popular stories
      
      // Calculate position
      const x = level === 0 ? 0 : parentX + (children.length > 1 ? (children.length - 1) * 150 : 0);
      const y = level * 200;
      
      nodes.push({
        id: story.id,
        type: 'storyNode',
        position: { x, y },
        data: {
          story,
          isHighlighted,
        },
      });
      
      // Process children
      let childX = x - (children.length - 1) * 75;
      children.forEach((child, index) => {
        edges.push({
          id: `${story.id}-${child.id}`,
          source: story.id,
          target: child.id,
          type: 'smoothstep',
          animated: child.votes > 10,
          style: {
            stroke: child.votes >= 20 ? '#fbbf24' : '#6b7280',
            strokeWidth: child.votes >= 20 ? 3 : 2,
          },
        });
        
        childX = buildTree(child.id, level + 1, childX);
        childX += 150;
      });
      
      return x;
    };
    
    buildTree(rootStoryId);
    
    return { nodes, edges };
  }, [stories, rootStoryId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-96 bg-gray-900 rounded-lg border border-gray-700">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#374151" gap={20} />
        <Controls className="bg-gray-800 border-gray-600" />
      </ReactFlow>
    </div>
  );
}
