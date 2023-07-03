import React, { useMemo, useState } from 'react'
import { HorizontalScroll, Link, Tabs, TabsItem } from '@vkontakte/vkui'

import './TechInfo.css'

export type TechInfoProps = {
  sections: Array<{ description: string; name: string; id: number }>
  items: Array<{ name: string; link: string; sectionId: number; id: number }>
}

let TechInfo: React.FC<TechInfoProps> = ({ sections, items }) => {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? 0)

  const description = useMemo(() => {
    const activeSection = sections.find((item) => item.id === activeSectionId)
    return activeSection?.description || ''
  }, [activeSectionId, sections])

  const activeItems = useMemo(() => {
    return items.filter((item) => item.sectionId === activeSectionId)
  }, [activeSectionId, items])

  return (
    <div className="TechInfo">
      <Tabs>
        <HorizontalScroll>
          {sections?.map((section) => (
            <TabsItem
              selected={activeSectionId === section.id}
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
            >
              {section.name}
            </TabsItem>
          ))}
        </HorizontalScroll>
      </Tabs>

      <div className="ThechInfo_description">{description}</div>

      <div className="ThechInfo_content">
        {activeItems.map((item) => (
          <div key={item.id} className="TechInfo_item">
            <Link target="_blank" href={item.link}>
              {item.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

TechInfo = React.memo(TechInfo)
export { TechInfo }
